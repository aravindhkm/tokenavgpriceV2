import { expect } from "chai";
import { ethers } from "hardhat";
const { deployDiamond } = require('../scripts/deploy.ts')
const { priceFeedV1 } = require('../scripts/priceFeedV1.ts')
const { priceFeedV2 } = require('../scripts/priceFeedV2.ts')
import {PriceFeedV2} from "../typechain/PriceFeedV2";
import {MyToken} from "../typechain/MyToken";
import { parseEther } from 'ethers/lib/utils';

describe("PriceFeed Contract", function () {
  let diamondAddress: string;
  let priceFeedAddress :  string
  let priceFeedInstance : PriceFeedV2
  let tokenInstance1 : MyToken
  let tokenInstance2 : MyToken
  let owner: any
  let user1 : any
  let user2 : any
  let addrs;


  before(async function () {
    diamondAddress = await deployDiamond()
    await priceFeedV1()
     priceFeedAddress =  await priceFeedV2()
    priceFeedInstance = await ethers.getContractAt('PriceFeedV2',diamondAddress)
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy();
    tokenInstance1 = await token.deployed();
    tokenInstance2 = await token.deployed();
    [owner, user1,user2, ...addrs] = await ethers.getSigners();
  })

  it("Owner should be able to submit the price", async function () {
    await expect(priceFeedInstance.connect(user1).submitPrices(
      tokenInstance1.address,
      parseEther('1'),
      "1",
      "1",
      "2021"
    )).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );    
  });

  it("Owner should be able to submit the price", async function () {
    await expect(priceFeedInstance.connect(user2).submitPrices(
      tokenInstance1.address,
      parseEther('1'),
      "1",
      "1",
      "2021"
    )).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );    
  });


  it("Submit the asset current price.", async function () {
      await priceFeedInstance.connect(owner).submitPrices(
        tokenInstance1.address,
        parseEther('1'),
        "1",
        "1",
        "2021"
      )

      await priceFeedInstance.connect(owner).submitPrices(
        tokenInstance1.address,
        parseEther('2'),
        "2",
        "1",
        "2021"
      )

      await priceFeedInstance.connect(owner).submitPrices(
        tokenInstance1.address,
        parseEther('3'),
        "3",
        "1",
        "2021"
      )

      await priceFeedInstance.connect(owner).submitPrices(
        tokenInstance1.address,
        parseEther('4'),
        "4",
        "1",
        "2021"
      )

      await priceFeedInstance.connect(owner).submitPrices(
        tokenInstance1.address,
        parseEther('5'),
        "5",
        "1",
        "2021"
      )
  });

  it("Get the average price of asset", async function () {
      let response = await priceFeedInstance.getAveragePrice(tokenInstance1.address,"1","6","2021","2022"); 
      expect(response).to.equal(parseEther('3'));
  });


  it("Get the average price of asset 2", async function () {
    let response = await priceFeedInstance.getAveragePrice(tokenInstance1.address,"1","10","2021","2022"); 
    expect(response).to.equal(parseEther('3'));
  });

  it("Submit the asset current price", async function () {
    await priceFeedInstance.connect(owner).submitPrices(
      tokenInstance2.address,
      parseEther('1'),
      "1",
      "1",
      "2021"
    )

    await priceFeedInstance.connect(owner).submitPrices(
      tokenInstance2.address,
      parseEther('2'),
      "2",
      "1",
      "2021"
    )

    await priceFeedInstance.connect(owner).submitPrices(
      tokenInstance2.address,
      parseEther('3'),
      "3",
      "1",
      "2021"
    )

    await priceFeedInstance.connect(owner).submitPrices(
      tokenInstance2.address,
      parseEther('4'),
      "1",
      "1",
      "2022"
    )

    await priceFeedInstance.connect(owner).submitPrices(
      tokenInstance2.address,
      parseEther('5'),
      "2",
      "1",
      "2022"
    )
});

  it("Get the average price of asset", async function () {
      let response = await priceFeedInstance.getAveragePrice(tokenInstance2.address,"1","6","2021","2022"); 
      expect(response).to.equal(parseEther('3'));
  });


  it("Get the average price of asset 2", async function () {
    let response = await priceFeedInstance.getAveragePrice(tokenInstance2.address,"1","10","2021","2022"); 
    expect(response).to.equal(parseEther('3'));
  });
});
