const TokenFarm = artifacts.require("TokenFarm");
const TfToken = artifacts.require("TFToken")
const DaiToken = artifacts.require('DaiToken')

module.exports = async function(deployer, network, accounts) {
  // Deploy Mock DaiToken
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()
  // Deploy Mock TFToken
  await deployer.deploy(TfToken)
  const tfToken = await TfToken.deployed()
  // Deploy TokenFarm
  await deployer.deploy(TokenFarm,tfToken.address,daiToken.address)
  const tokenFarm = await TokenFarm.deployed()
  // Transfer all tftokens to the tokenfarm
  await tfToken.transfer(tokenFarm.address, '1000000000000000000000000')
  // Transfer 100 Mock Dai to investor
  await daiToken.transfer(accounts[1], '100000000000000000000' )

};
