const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const oneDay = 60 * 60 * 24;
const passTime = (timeInDays) => {
  ethers.provider.send("evm_increaseTime", [timeInDays])
  ethers.provider.send("evm_mine")
};

  let Consistently;
  let contract;
  let signer0;
  let signer1;
  let signer0Address;
  let signer1Address;
  let aavePoolAddress = "0xe91E690407977F0b9fDc655504b895Fe4af0C371";


 before(async () => {
      Consistently = await ethers.getContractFactory("Consistently");
      contract = await Consistently.deploy(aavePoolAddress);
      await contract.deployed();
      signer0 = await ethers.provider.getSigner(0);
      signer0Address = await signer0.getAddress();

      signer1 = await ethers.provider.getSigner(1);
      signer1Address = await signer1.getAddress();
  });
 

xdescribe("Consistently Registration", function () { 
  before(async () => {
     // The user vows to promise to quit smoking and vows 1 ether
      await contract.connect(signer0).register("I am ready to quit smoking", 21, {
        value: ethers.utils.parseEther("1")
      });
  })
  it("Should allow a user register successfully", async function () {
     
      //user is mapped in UserIntetions
      let firstIntentions = await contract.callStatic.intentions(0); // Retrieve Users from the Intentions Array
      assert.equal(firstIntentions.userAddress, signer0Address);

  })
  it("should Map the Intention Id Correctly after Registration", async () => { 
     // Intention Id mus be set Properly 
     let intentionId = await contract.callStatic.userIntentions(signer0Address);
     assert.equal(intentionId, 1);
  }) 

  it("should set the current Blocktimestamp as the last Checkin Time and the Next CheckinTime as the Next 24 Hours.", async () => {
    //set the current BlockTimeStamp
    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    const timestamp = block.timestamp;  

    // Last Check In should be now
    let checkInTime = await contract.lastCheckIn(signer0Address);
    assert.equal(checkInTime, timestamp);
    // Next Check in should be in 1 day 
    let nextCheckInTime = await contract.nextCheckIn(signer0Address);
    assert.equal(nextCheckInTime, timestamp + 86400);
  })

  describe("after 24 hours has elapsed", () => {
      before(async () => { 
        await passTime(oneDay * 1 + 600);
      });

      it("Should allow a Registered user to checkin", async() => {  
  
        await expect(contract.connect(signer0).checkin())
        .to.be.not.reverted

      })

      //TODO: For some reason this state is not changed
      it("should mint a Habit Token to the user after checkin", async() => {
        let habitAddress = await contract.habit();

        let habit = await ethers.getContractAt("IERC20", habitAddress);
        const balance = await habit.balanceOf(signer0Address);
        assert.equal(balance, "1");

      } )
      it("should increase the User Checkin Count by one", async() =>{
        
        let checkInCount = await contract.callStatic.checkInCount(signer0Address);
        assert.equal(checkInCount, 1);

      })
      //TODO: For some reason the state did not change after the function was run
      it("should reset the last checkin time", async() =>{
        const blockNumAfter = await ethers.provider.getBlockNumber();
        const blockAfter = await ethers.provider.getBlock(blockNumAfter);
        const timestampAfter = blockAfter.timestamp;

        // console.log("Time at Check In ", timestampAfter)
        let checkInTime = await contract.callStatic.lastCheckIn(signer0Address);
        assert.equal(checkInTime, timestampAfter);

      })

      it("Should NOT allow an Unregistered User to checkin", async() => {  
        await expect(contract.connect(signer1).checkin())
        .to.be.reverted
      })

      
  })  
   describe("after 72 hours has elapsed from last Checkin", () => {
      before(async () => {
        await passTime(oneDay * 3 + 400);
      })

      it("Should allow a Registered user to checkin Despite Being late", async() => {  
        await expect(contract.connect(signer0).checkin())
        .to.be.not.reverted

      })

      it("should penalize the User for late Checkin", async() =>{
        // Get the first Registered User
        let intention = await contract.callStatic.intentions(0);
        assert.equal(intention.defaulted, 1); // User has defaulted once
        assert.equal(intention.weiBalance._hex, ethers.utils.parseUnits("0.75", "18")._hex)
      })

      it("should deactivate the user after being late 3 more times, and zero the Balance",async () => {
        for(let i=1; i < 4; i++){
          
          await passTime(oneDay * 3 + 400);
          await contract.connect(signer0).checkin()
        }

        let intention = await contract.callStatic.intentions(0);
       
        assert.equal(intention.defaulted, 4); // User has defaulted once
        assert.equal(intention.weiBalance._hex, ethers.utils.parseUnits("0", "18")._hex)
        assert.equal(intention.active, false)
      })

      it("Should not be able to check in user after deactiviation", async () => {
        await expect(contract.connect(signer0).checkin())
        .to.be.reverted
      })
  })


    // We need to test for being late 4 times
    // We need to test for being able to redeem after the specified number of days
});

describe("Consistently Checkin", function () {
  before(async () => {
     // The user vows to promise to quit smoking and vows 1 ether
      await contract.connect(signer0).register("I am ready to quit smoking", 21, {
        value: ethers.utils.parseEther("1")
      });
  })
  it("Should allow a user Checkin Within within Days for the specified number of days", async function () {
      
    for(let i=1; i <=21; i++){
      await passTime(oneDay * 1 + 400);
      await contract.connect(signer0).checkin();
       
      //set the current BlockTimeStamp
      let blockNum = await ethers.provider.getBlockNumber();
      let block = await ethers.provider.getBlock(blockNum);
      let timestamp = block.timestamp;  

     
      // Last Check In should be now
      let checkInTime = await contract.callStatic.lastCheckIn(signer0Address);
      assert.equal(checkInTime, timestamp);
    }

    let checkInCount = await contract.callStatic.checkInCount(signer0Address);
    assert.equal(checkInCount, 21);

  })

  it("should allow the user to redeem after the number of days have elapsed", async () =>{
    
  })
})
 