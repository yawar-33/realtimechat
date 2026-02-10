import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    { name: 'chat.db', location: 'default' },
    () => { },
    error => { console.log('DB Error: ', error) }
);

export const Database = {
    init() {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, sender TEXT, text TEXT, timestamp INTEGER)',
                []
            );
        });
    },

    saveMessage(message) {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'INSERT INTO messages (id, sender, text, timestamp) VALUES (?, ?, ?, ?)',
                    [message.id, message.sender, message.text, message.timestamp],
                    (_, results) => resolve(results),
                    (_, error) => reject(error)
                );
            });
        });
    },

    getMessages(page = 0, limit = 20) {
        const offset = page * limit;
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM messages ORDER BY timestamp DESC LIMIT ? OFFSET ?',
                    [limit, offset],
                    (_, results) => {
                        let rows = [];
                        for (let i = 0; i < results.rows.length; i++) {
                            rows.push(results.rows.item(i));
                        }
                        resolve(rows.reverse()); // Keep chronological order for UI
                    },
                    (_, error) => reject(error)
                );
            });
        });
    },

    deleteExpiredMessages() {
        const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'DELETE FROM messages WHERE timestamp < ?',
                    [twoHoursAgo],
                    (_, results) => resolve(results),
                    (_, error) => reject(error)
                );
            });
        });
    },

    clearAllMessages() {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'DELETE FROM messages',
                    [],
                    (_, results) => resolve(results),
                    (_, error) => reject(error)
                );
            });
        });
    }
};
