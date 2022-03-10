import Database from "../db";
import Intention from "../models/Intention";

class IntentionService {
    constructor(userAddress, habit, timeRegistered, active){
        this.userAddress = userAddress;
        this.habit = habit;
        this.timeRegistered = timeRegistered;
        this.active = active;
    }

    async insertIntention(){
        let db = new Database();
        let intention = new Intention(this.userAddress, this.habit, this.timeRegistered, this.active);
        let insertQuery = intention.insertQuery();
        let result = await db.insert(insertQuery);
        db.closeConnection();
        return result;
    }
    async disableIntention(){
        let db = new Database();
        let intention = new Intention(this.userAddress, this.habit, this.timeRegistered, this.active);
        let disableQuery = intention.disableQuery();
        let result = await db.run(disableQuery);
        db.closeConnection();
        return result;
    }
    async getAllIntentions(){
        let db = new Database();
        let intention = new Intention(this.userAddress, this.habit, this.timeRegistered, this.active);
        let selectQuery = intention.selectQuery();
        let result = await db.all(selectQuery);
        db.closeConnection();
        return result;
    }
}

module.exports = IntentionService;