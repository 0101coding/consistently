class CheckInHistory {
    constructor(userAddress, checkInTime, intentionId, note){
        this.userAddress = userAddress;
        this.checkInTime = checkInTime;
        this.intentionId = intentionId;
        this.note = note;
    }

    insertQuery(){
        sql = `INSERT INTO CheckInHistory (userAddress, checkInTime, intentionId, note) VALUES 
        ('${this.userAddress}', '${this.checkInTime}', ${this.intentionId}, '${this.note}')
        `;
        return $sql;
    }
    selectQuery() {
        let sql = `SELECT * FROM CheckInHistory`;
        return sql;
    }
}

module.exports = CheckInHistory;