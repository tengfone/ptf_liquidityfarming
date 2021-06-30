const TokenFarm = artifacts.require("TokenFarm");
const TfToken = artifacts.require("TFToken")
const DaiToken = artifacts.require('DaiToken')

module.exports = async function (callback) {

    let tokenFarm = await TokenFarm.deployed()
    await tokenFarm.issueTokens()

    console.log("Tokens Issued!")

    callback()
};
