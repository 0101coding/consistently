import Database from "../db";
import LastCheckIn from "../models/LastCheckIn";

class LastCheckInService {
    constructor(userAddress, lastCheckIn, intentionId){
        this.userAddress = userAddress;
        this.lastCheckIn = lastCheckIn;
        this.intentionId = intentionId;
    }

    async saveLastCheckIn(){
          let db = new Database();
        let checkIn = new LastCheckIn(this.userAddress, this.lastCheckIn, this.intentionId);
        let insertQuery = checkIn.insertQuery();
        let result = await db.insert(insertQuery);
        db.closeConnection();
        return result;
    }

     async updateLastCheckIn(){
          let db = new Database();
        let checkIn = new LastCheckIn(this.userAddress, this.lastCheckIn, this.intentionId);
        let updateQuery = checkIn.updateQuery();
        let result = await db.run(updateQuery);
        db.closeConnection();
        return result;
    }

    async getAllLastCheckIn(){
        let db = new Database();
        let checkIn = new LastCheckIn(this.userAddress, this.lastCheckIn, this.intentionId);
        let selectQuery = checkIn.selectQuery();
        let result = await db.all(selectQuery);
        db.closeConnection();
        return result;
    }
}

module.exports = LastCheckInService;