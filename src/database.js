const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const errors = require('./errors');

class Database {
  constructor(file = 'morsel-database.json') {
    if (typeof file !== 'string') {
      throw errors.INVALID_VALUE;
    }
    this.filePath = path.resolve(file);
    this.data = {};
    this.load();
  }

  /**
   * Loads the database file and parses its content.
   * @throws {Error} If the file cannot be read or parsed.
   */
  async load() {
    try {
      const fileExists = await fs.access(this.filePath).then(() => true).catch(() => false);
      if (fileExists) {
        const fileData = await fs.readFile(this.filePath, 'utf8');
        try {
          this.data = JSON.parse(fileData);
        } catch {
          throw errors.INVALID_JSON;
        }
      } else {
        throw errors.FILE_NOT_FOUND;
      }
    } catch (err) {
      console.error(chalk.red('Error loading database:'), chalk.red(err.message));
      throw err;
    }
  }

  /**
   * Saves the current database content to the file.
   * @throws {Error} If the file cannot be written.
   */
  async save() {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.data, null, 2));
    } catch (err) {
      console.error(chalk.red('Error saving database:'), chalk.red(err.message));
      throw errors.FILE_NOT_FOUND;
    }
  }

  /**
   * Sets a value for a given key.
   * @param {string} key - The key to set.
   * @param {*} value - The value to set.
   * @throws {Error} If the key is not a string or value is null/undefined.
   */
  async set(key, value) {
    if (typeof key !== 'string' || value === null || value === undefined) {
      throw errors.INVALID_VALUE;
    }
    this.data[key] = value;
    await this.save();
  }

  /**
   * Pushes a value into an array at the specified key.
   * @param {string} key - The key for the array.
   * @param {*} value - The value to push.
   * @throws {Error} If the key is not a string or value is null/undefined.
   */
  async push(key, value) {
    if (typeof key !== 'string' || value === null || value === undefined) {
      throw errors.INVALID_VALUE;
    }
    if (!Array.isArray(this.data[key])) {
      this.data[key] = [];
    }
    this.data[key].push(value);
    await this.save();
  }

  /**
   * Fetches a sub-value from an object stored at the given key.
   * @param {string} key - The key for the object.
   * @param {string} subKey - The sub-key for the value.
   * @returns {*} The value of the sub-key.
   * @throws {Error} If the key or sub-key is not a string or object is not found.
   */
  objectFetch(key, subKey) {
    if (typeof key !== 'string' || typeof subKey !== 'string') {
      throw errors.INVALID_VALUE;
    }
    const object = this.data[key];
    if (!object || typeof object !== 'object') {
      throw errors.OBJECT_NOT_FOUND;
    }
    return object[subKey];
  }

  /**
   * Fetches a value from an array at the specified key and index.
   * @param {string} key - The key for the array.
   * @param {number} index - The index of the value.
   * @returns {*} The value at the index.
   * @throws {Error} If the key is not a string or index is not an integer or array is not found.
   */
  arrayFetch(key, index) {
    if (typeof key !== 'string' || !Number.isInteger(index)) {
      throw errors.INVALID_VALUE;
    }
    const array = this.data[key];
    if (!Array.isArray(array)) {
      throw errors.ARRAY_NOT_FOUND;
    }
    return array[index];
  }

  /**
   * Fetches the value at the specified key.
   * @param {string} key - The key for the value.
   * @returns {*} The value associated with the key.
   * @throws {Error} If the key is not a string.
   */
  fetch(key) {
    if (typeof key !== 'string') {
      throw errors.INVALID_VALUE;
    }
    return this.data[key];
  }

  /**
   * Removes a key from the database.
   * @param {string} key - The key to remove.
   * @throws {Error} If the key is not a string.
   */
  async remove(key) {
    if (typeof key !== 'string') {
      throw errors.INVALID_VALUE;
    }
    delete this.data[key];
    await this.save();
  }

  /**
   * Deletes a value from an array stored at the given key.
   * @param {string} key - The key for the array.
   * @param {*} value - The value to delete.
   * @throws {Error} If the key is not a string or value is null/undefined.
   */
  async delete(key, value) {
    if (typeof key !== 'string' || value === null || value === undefined) {
      throw errors.INVALID_VALUE;
    }
    if (Array.isArray(this.data[key])) {
      this.data[key] = this.data[key].filter(item => item !== value);
      await this.save();
    }
  }

  /**
   * Deletes a sub-key from an object stored at the given key.
   * @param {string} objectKey - The key for the object.
   * @param {string} key - The sub-key to delete.
   * @throws {Error} If the objectKey or key is not a string or object is not found.
   */
  async deleteKey(objectKey, key) {
    if (typeof objectKey !== 'string' || typeof key !== 'string') {
      throw errors.INVALID_VALUE;
    }
    if (this.data[objectKey] && typeof this.data[objectKey] === 'object') {
      delete this.data[objectKey][key];
      await this.save();
    } else {
      throw errors.OBJECT_NOT_FOUND;
    }
  }

  /**
   * Deletes all keys that start with the specified key.
   * @param {string} key - The prefix for the keys to delete.
   * @throws {Error} If the key is not a string.
   */
  async deleteEach(key) {
    if (typeof key !== 'string') {
      throw errors.INVALID_VALUE;
    }
    for (let k in this.data) {
      if (k.startsWith(key)) {
        delete this.data[k];
      }
    }
    await this.save();
  }

  /**
   * Clears all data in the database.
   * @throws {Error} If there is an issue with saving the cleared data.
   */
  async clear() {
    this.data = {};
    await this.save();
  }

  /**
   * Deletes the database file and clears the data.
   * @throws {Error} If the file cannot be deleted or data cannot be cleared.
   */
  async destroy() {
    try {
      await fs.unlink(this.filePath);
      await this.clear();
    } catch (err) {
      console.error(chalk.red('Error destroying database:'), chalk.red(err.message));
      throw errors.FILE_NOT_FOUND;
    }
  }

  /**
   * Checks if a key exists in the database.
   * @param {string} key - The key to check.
   * @returns {boolean} True if the key exists, false otherwise.
   * @throws {Error} If the key is not a string.
   */
  has(key) {
    if (typeof key !== 'string') {
      throw errors.INVALID_VALUE;
    }
    return this.data.hasOwnProperty(key);
  }

  /**
   * Adds a number to the value stored at the given key.
   * @param {string} key - The key for the value.
   * @param {number} value - The value to add.
   * @throws {Error} If the key is not a string or value is not a number.
   */
  async add(key, value) {
    if (typeof key !== 'string' || typeof value !== 'number') {
      throw errors.INVALID_VALUE;
    }
    if (typeof this.data[key] === 'number') {
      this.data[key] += value;
      await this.save();
    } else {
      throw errors.INVALID_VALUE;
    }
  }

  /**
   * Subtracts a number from the value stored at the given key.
   * @param {string} key - The key for the value.
   * @param {number} value - The value to subtract.
   * @throws {Error} If the key is not a string or value is not a number.
   */
  async subtract(key, value) {
    if (typeof key !== 'string' || typeof value !== 'number') {
      throw errors.INVALID_VALUE;
    }
    if (typeof this.data[key] === 'number') {
      this.data[key] -= value;
      await this.save();
    } else {
      throw errors.INVALID_VALUE;
    }
  }

/**
   * Multiplies the value stored at the given key by a number.
   * @param {string} key - The key for the value.
   * @param {number} value - The value to multiply by.
   * @throws {Error} If the key is not a string or value is not a number.
   */
  async multiply(key, value) {
    if (typeof key !== 'string' || typeof value !== 'number') {
      throw errors.INVALID_VALUE;
    }
    if (typeof this.data[key] === 'number') {
      this.data[key] *= value;
      await this.save();
    } else {
      throw errors.INVALID_VALUE;
    }
  }

  /**
   * Divides the value stored at the given key by a number.
   * @param {string} key - The key for the value.
   * @param {number} value - The value to divide by.
   * @throws {Error} If the key is not a string or value is not a number or division by zero.
   */
  async divide(key, value) {
    if (typeof key !== 'string' || typeof value !== 'number') {
      throw errors.INVALID_VALUE;
    }
    if (typeof this.data[key] === 'number') {
      if (value === 0) {
        throw errors.DIVISION_BY_ZERO;
      }
      this.data[key] /= value;
      await this.save();
    } else {
      throw errors.INVALID_VALUE;
    }
  }

  /**
   * Gets all keys from the database.
   * @returns {Array<string>} The list of all keys.
   */
  getAllKeys() {
    return Object.keys(this.data);
  }

  /**
   * Gets all values from the database.
   * @returns {Array<*>} The list of all values.
   */
  getAllValues() {
    return Object.values(this.data);
  }
}

module.exports = Database;