//Database connection file.

const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('database.db', (err) => {

    if (err) {
        console.error('There was an error when connecting to the database: ', err);
    } else {
        console.log('Successfully connected to the database.');
    }

});

module.exports=db;