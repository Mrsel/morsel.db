---

# Morsel DB

Morsel DB is a JSON file-based database management module that offers simple usage and high performance for organizing your data.

## Installation

You can easily install Morsel DB via npm:

```bash
npm install morsel.db
```

## Getting Started

First, define your database file. If you don't specify a file name, Morsel DB will use `data.json` by default.

```javascript
const { Database } = require('morsel.db');
const db = new Database('file.json'); // Replace 'file.json' with your desired file name.
```

### TypeScript Usage

Morsel DB also supports TypeScript. To use it with TypeScript, follow these steps:

1. **Install TypeScript** (if not already installed):

    ```bash
    npm install typescript --save-dev
    ```
    
2. **Install Type Definitions**:

    Install the type definitions for Morsel DB:

    ```bash
    npm install --save-dev @types/morsel.db
    ```

3. **Example Usage with TypeScript**:

    ```typescript
    import { Database } from 'morsel.db';

    const db = new Database('file.json');

    const object1 = { key: true, key2: "true" };
    db.set('Object', object1); // 'Object': { key: true, key2: "true" }

    const array1: string[] = ['element', 'element2'];
    db.set('Array', array1); // 'Array': ['element', 'element2']

    db.push('Array', 'element3'); // 'Array': ['element', 'element2', 'element3']
    ```

## Example Usage

### Set / Push Functions

To set data and push elements to arrays, use the following methods:

```javascript
const { Database } = require('morsel.db');
const db = new Database('file.json');

const object1 = { key: true, key2: "true" };
db.set('Object', object1); // 'Object': { key: true, key2: "true" }

const array1 = ['element', 'element2'];
db.set('Array', array1); // 'Array': ['element', 'element2']

db.push('Array', 'element3'); // 'Array': ['element', 'element2', 'element3']
```

### Data Retrieval

To retrieve data, use these methods:

```javascript
db.objectFetch('Object', 'key'); // 'key': true
db.arrayFetch('Array', 1); // 'element2'
db.fetch('data'); // Fetches the value of 'data'
db.get('data'); // Fetches the value of 'data'
db.fetchAll(); // Fetches all data in the database
db.all(); // Fetches all data in the database
```

### Data Deletion

To delete data, use these methods:

```javascript
db.remove('data'); // Removes 'data' from the database
db.delete('Array', 'element3'); // Removes 'element3' from the array
db.deleteKey('Object', 'key'); // Deletes 'key' from the 'Object'
db.deleteEach('data'); // Deletes all keys starting with 'data'
```

### Clearing and Destroying the Database

To clear all data or delete the database file:

```javascript
db.clear(); // Clears all data in the database
db.destroy(); // Deletes the database file and clears all data
```

### Boolean Functions

To check if data exists:

```javascript
db.has('data'); // Returns true or false if 'data' exists
```

### Mathematical Operations

To perform mathematical operations on data:

```javascript
db.add('data', 1); // Adds 1 to 'data'
db.subtract('data', 1); // Subtracts 1 from 'data'
db.math('eco', '+', 10); // Adds 10 to 'eco'
```

### Multiple Files

You can use multiple database files:

```javascript
const bot = new Database('bot-config.json');
const servers = new Database('servers-config.json');
const users = new Database('users.json');

servers.push('servers', '800060636041314375');
bot.set('prefix', '#');
users.set('whitelist_747430301654974546', true);
```

### Data Backup

To backup and restore your data:

```javascript
db.setBackup('backup.json'); // Sets 'backup.json' as the backup file
db.loadBackup('backup.json'); // Loads the backup file
```

## Use Cases

Morsel DB is suitable for various use cases including:

- **Bot Configuration**: Store and manage configuration settings for bots.
- **User Management**: Maintain user-related data such as preferences and permissions.
- **Game Data**: Save game states or player data in applications.
- **Task Management**: Track tasks, lists, and project data.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](./LICENSE) file for details.

---