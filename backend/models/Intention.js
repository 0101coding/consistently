class  Intention {  
    constructor(userAddress, habit, timeRegistered, active){
        this.userAddress = userAddress;
        this.habit = habit;
        this.timeRegistered = timeRegistered;
        this.active = active;
    }

    insertQuery(){
        let sql = `INSERT INTO Intentions (userAddress, habit, timeRegistered, active) VALUES
         ('${this.userAddress}', '${this.habit}', '${this.timeRegistered}', ${this.active})`;
         return sql;
    }
    disableQuery() {
        let sql = `UPDATE Intentions set active = 0 WHERE userAddress = '${this.userAddress}'`;
        return sql;
    }
    selectQuery() {
        let sql = `SELECT * FROM Intentions`;
        return sql;
    }
}

module.exports = Intention;