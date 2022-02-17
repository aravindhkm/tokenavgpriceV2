// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
const hre = require("hardhat");
const { getSelectors,getSelector, FacetCutAction } = require('./libraries/diamond.js');
const fs = require('fs');


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const diamondAddress = fs.readFileSync('./DeployAddress.txt', 'utf-8');
  const diamondCut = await ethers.getContractAt('IDiamondCut', diamondAddress)

  const PriceFeedV2 = await ethers.getContractFactory("PriceFeedV2");
  const priceV2 = await PriceFeedV2.deploy();


  console.log("getSelectors", getSelectors(priceV2));


  await priceV2.deployed();
  console.log("PriceFeedV2 deployed to:", priceV2.address);

  // await hre.run("verify:verify", {
  //   address: PriceFeedV2.address,
  //   constructorArguments: [],
  // });


  let tx
  let receipt
  const cut = []

  cut.push({
    facetAddress: priceV2.address,
    action: FacetCutAction.Replace,
    functionSelectors: getSelectors(priceV2)
  })

  const zeroAddress = "0x0000000000000000000000000000000000000000";
  let functionCall = priceV2.interface.encodeFunctionData('initialize')
  tx = await diamondCut.diamondCut(cut, zeroAddress, "")
  console.log('Diamond cut tx: ', tx.hash)
  receipt = await tx.wait()
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`)
  }
  console.log('Completed diamond cut')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


