import { expect } from "chai";
import { ethers } from "hardhat";
const { deployDiamond } = require('../scripts/deploy.ts')
const { priceFeedV1 } = require('../scripts/priceFeedV1.ts')
import {PriceFeedV1} from "../typechain/PriceFeedV1";
import {MyToken} from "../typechain/MyToken";
import { parseEther } from 'ethers/lib/utils';

describe("PriceFeed Contract", function () {
  let diamondAddress: string;
  let priceFeedAddress :  string
  let priceFeedInstance : PriceFeedV1
  let tokenInstance1 : MyToken
  let tokenInstance2 : MyToken
  let owner: any
  let user : any
  let addrs;


  before(async function () {
    diamondAddress = await deployDiamond()
    priceFeedAddress =  await priceFeedV1()
    priceFeedInstance = await ethers.getContractAt('PriceFeedV1',diamondAddress)
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy();
    tokenInstance1 = await token.deployed();
    tokenInstance2 = await token.deployed();
    [owner, user, ...addrs] = await ethers.getSigners();
  })

  it("Initializer does not run again", async function () {
    await expect(priceFeedInstance.initialize()).to.be.revertedWith(
      "Initializable: contract is already initialized"
    );    
  });

  it("Submit the asset current price.", async function () {
      await priceFeedInstance.connect(user).submitPrices(
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

      await priceFeedInstance.connect(user).submitPrices(
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

      await priceFeedInstance.connect(user).submitPrices(
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

  it("Submit the asset current price.", async function () {
    await priceFeedInstance.connect(user).submitPrices(
      tokenInstance2.address,
      parseEther('1'),
      "1",
      "1",
      "2021"
    )

    await priceFeedInstance.connect(user).submitPrices(
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

    await priceFeedInstance.connect(user).submitPrices(
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
