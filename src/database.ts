declare module "morsel-json.db" {
  export class Database {
    constructor(file?: string);

    /**
     * Creates a backup of the current database.
     * @param backupPath - The path to save the backup file.
     */
    createBackup(backupPath?: string): Promise<void>;

    /**
     * Restores the database from a backup file.
     * @param backupPath - The path to the backup file.
     */
    restoreBackup(backupPath: string): Promise<void>;

    /**
     * Sets a value for a given key in the database.
     * @param key - The key to set.
     * @param value - The value to set.
     */
    set(key: string, value: any): Promise<void>;

    /**
     * Pushes a value into an array at the specified key.
     * @param key - The key for the array.
     * @param value - The value to push.
     */
    push(key: string, value: any): Promise<void>;

    /**
     * Fetches a sub-value from an object stored at the given key.
     * @param key - The key for the object.
     * @param subKey - The sub-key for the value.
     * @returns The value of the sub-key.
     */
    objectFetch(key: string, subKey: string): any;

    /**
     * Fetches a value from an array at the specified key and index.
     * @param key - The key for the array.
     * @param index - The index of the value.
     * @returns The value at the index.
     */
    arrayFetch(key: string, index: number): any;

    /**
     * Fetches the value at the specified key.
     * @param key - The key for the value.
     * @returns The value associated with the key.
     */
    fetch(key: string): any;

    /**
     * Removes a key from the database.
     * @param key - The key to remove.
     */
    remove(key: string): Promise<void>;

    /**
     * Deletes a value from an array stored at the given key.
     * @param key - The key for the array.
     * @param value - The value to delete.
     */
    delete(key: string, value: any): Promise<void>;

    /**
     * Deletes a sub-key from an object stored at the given key.
     * @param objectKey - The key for the object.
     * @param key - The sub-key to delete.
     */
    deleteKey(objectKey: string, key: string): Promise<void>;

    /**
     * Deletes all keys that start with the specified key.
     * @param key - The prefix for the keys to delete.
     */
    deleteEach(key: string): Promise<void>;

    /**
     * Clears all data in the database.
     */
    clear(): Promise<void>;

    /**
     * Deletes the database file and clears the data.
     */
    destroy(): Promise<void>;

    /**
     * Checks if a key exists in the database.
     * @param key - The key to check.
     * @returns True if the key exists, false otherwise.
     */
    has(key: string): boolean;

    /**
     * Adds a number to the value stored at the given key.
     * @param key - The key for the value.
     * @param value - The value to add.
     */
    add(key: string, value: number): Promise<void>;

    /**
     * Subtracts a number from the value stored at the given key.
     * @param key - The key for the value.
     * @param value - The value to subtract.
     */
    subtract(key: string, value: number): Promise<void>;

    /**
     * Multiplies the value stored at the given key by a number.
     * @param key - The key for the value.
     * @param value - The multiplier.
     */
    multiply(key: string, value: number): Promise<void>;

    /**
     * Divides the value stored at the given key by a number.
     * @param key - The key for the value.
     * @param value - The divisor.
     */
    divide(key: string, value: number): Promise<void>;

    /**
     * Applies the modulo operation on the value stored at the given key.
     * @param key - The key for the value.
     * @param value - The divisor for modulo operation.
     */
    mod(key: string, value: number): Promise<void>;

    /**
     * Raises the value stored at the given key to the power of an exponent.
     * @param key - The key for the value.
     * @param exponent - The exponent to raise the value to.
     */
    power(key: string, exponent: number): Promise<void>;

    /**
     * Creates a backup of the database file.
     * @param backupFile - The path to the backup file.
     */
    setBackup(backupFile: string): Promise<void>;

    /**
     * Loads data from a backup file and replaces the current database content.
     * @param backupFile - The path to the backup file.
     */
    loadBackup(backupFile: string): Promise<void>;
  }
}