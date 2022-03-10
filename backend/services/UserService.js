import Database from "../db";
import User from "../models/User";

class UserService{
    constructor(userAddress, noOfHabitsRegistered){
        this.userAddress = userAddress;
        this.noOfHabitsRegistered = noOfHabitsRegistered;
    }

    saveUser(){
        let db = new Database();
        let user = new User(this.userAddress, 1);
        let insertQuery = user.insertQuery();
        let result = await db.insert(insertQuery);
        db.closeConnection();
        return result;
    }

     updateQuery(){
        let db = new Database();
        let user = new User(this.userAddress, 1);
        let updateQuery = user.updateQuery();
        let result = await db.run(updateQuery);
        db.closeConnection();
        return result;
    }

    getUser(){
        let db = new Database();
        let user = new User(this.userAddress, 1);
        let selectSingleQuery = user.selectSingleQuery();
        let result = await db.run(selectSingleQuery);
        db.closeConnection();
        return result;
    }

    getAllUsers(){
        let db = new Database();
        let user = new User(this.userAddress, 1);
        let selectQuery = user.selectQuery();
        let result = await db.run(selectQuery);
        db.closeConnection();
        return result;
    }
}

module.exports = UserService;