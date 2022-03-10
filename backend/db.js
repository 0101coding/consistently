const sqlite3 = require('sqlite3').verbose();

class Database { 
    constructor(){
        this.db = new sqlite3.Database('./cons.db');
    }

    async insert(insertQuery){
        const result = await this.db.run(insertQuery);
        return result;
    }
    
    async select(selectQuery){
        const result = await this.db.all(selectQuery);
        return result;
    }

    closeConnection(){
        this.db.close();
    }
}

module.exports = Database;