import { expect } from "chai";
import { ethers } from "hardhat";
const { deployDiamond } = require('../scripts/deploy.ts')
const { priceFeedV1 } = require('../scripts/priceFeedV1.ts')
const { priceFeedV2 } = require('../scripts/priceFeedV2.ts')
const { priceFeedV3 } = require('../scripts/priceFeedV3.ts')
import {PriceFeedV3} from "../typechain/PriceFeedV3";
import {MyToken} from "../typechain/MyToken";
import { parseEther } from 'ethers/lib/utils';

describe("PriceFeed Contract", function () {
  let diamondAddress: string;
  let priceFeedAddress :  string
  let priceFeedInstance : PriceFeedV3
  let tokenInstance1 : MyToken
  let tokenInstance2 : MyToken
  let owner: any
  let user : any
  let addrs;


  before(async function () {
    diamondAddress = await deployDiamond()
    await priceFeedV1()
    await priceFeedV2()
    priceFeedAddress =  await priceFeedV3()
    priceFeedInstance = await ethers.getContractAt('PriceFeedV3',diamondAddress)
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy();
    tokenInstance1 = await token.deployed();
    tokenInstance2 = await token.deployed();
    [owner, user, ...addrs] = await ethers.getSigners();
  })

  it("Submit the asset current price.", async function () {
      await priceFeedInstance.connect(user).submitPrices(
        tokenInstance1.address,
        parseEther('1')
      )

      await priceFeedInstance.connect(owner).submitPrices(
        tokenInstance1.address,
        parseEther('2')
      )

      await priceFeedInstance.connect(user).submitPrices(
        tokenInstance1.address,
        parseEther('3')
      )

      await priceFeedInstance.connect(owner).submitPrices(
        tokenInstance1.address,
        parseEther('4')
      )

      await priceFeedInstance.connect(user).submitPrices(
        tokenInstance1.address,
        parseEther('5')
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

  it("Submit the asset current price.", async function () {
    await priceFeedInstance.connect(user).submitPrices(
      tokenInstance2.address,
      parseEther('1')
    )

    await priceFeedInstance.connect(user).submitPrices(
      tokenInstance2.address,
      parseEther('2')
    )

    await priceFeedInstance.connect(owner).submitPrices(
      tokenInstance2.address,
      parseEther('3')
    )

    await priceFeedInstance.connect(user).submitPrices(
      tokenInstance2.address,
      parseEther('4')
    )

    await priceFeedInstance.connect(owner).submitPrices(
      tokenInstance2.address,
      parseEther('5')
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
