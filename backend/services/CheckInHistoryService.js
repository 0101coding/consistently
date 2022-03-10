import Database from "../db";
import CheckInHistory from "../models/CheckInHistory";

class CheckInHistoryService { 
    constructor(userAddress, checkInTime, intentionId, note){
        this.userAddress = userAddress;
        this.checkInTime = checkInTime;
        this.intentionId = intentionId;
        this.note = note;
    } 

    async saveCheckInHistory(){
        let db = new Database();
        let checkIn = new CheckInHistory(this.userAddress, this.checkInTime, this.intentionId, this.note);
        let insertQuery = checkIn.insertQuery();
        let result = await db.insert(insertQuery);
        db.closeConnection();
        return result;
    }

    async getAllCheckInHistory(){
        let db = new Database();
        let checkIn = new CheckInHistory(this.userAddress, this.checkInTime, this.intentionId, this.note);
        let selectQuery = checkIn.selectQuery();
        let result = await db.all(selectQuery);
        db.closeConnection();
        return result;
    }
}

module.exports = CheckInHistoryService;