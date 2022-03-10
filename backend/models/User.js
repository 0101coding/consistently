class User {
    constructor(userAddress, noOfHabitsRegistered){
        this.userAddress = userAddress;
        this.noOfHabitsRegistered = noOfHabitsRegistered;
    }

    insertQuery() {
        let sql = `INSERT INTO Users (userAddress, noOfHabitRegistered) VALUES
        ('${this.userAddress}', ${this.noOfHabitsRegistered})`;
    }

    updateQuery() {
        let sql = `UPDATE Users set noOfHabitRegistered = noOfHabitRegistered + 1 where userAddress = '${this.userAddress}'`;
        return sql;
    }

    selectQuery() {
        let sql = `SELECT * FROM Users`;
        return sql;
    }

    selectSingleQuery() {
        let sql = `SELECT * FROM Users WHERE userAddress = '${this.userAddress}'`;
        return sql;
    }
}

module.exports = User;