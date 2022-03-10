
class LastCheckIn {
    constructor(userAddress, lastCheckIn, intentionId){
        this.userAddress = userAddress;
        this.lastCheckIn = lastCheckIn;
        this.intentionId = intentionId;
    }
    insertQuery() {
        let sql = `INSERT INTO LastCheckIn (userAddress, lastCheckIn, intentionId)
        VALUES('${this.userAddress}', '${this.lastCheckIn}', ${this.intentionId});
        `;
        return sql;
    }
    updateQuery(){
        let sql = `UPDATE LastCheckIn set lastCheckIn = '${this.lastCheckIn} where userAddress = ${this.userAddress}`;
        return sql;
    }
    selectQuery() {
        let sql = `SELECT * FROM LastCheckIn`;
        return sql;
    }
}

module.exports = LastCheckIn;