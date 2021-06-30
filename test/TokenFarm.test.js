const { assert } = require('chai');
const _deploy_contracts = require('../migrations/2_deploy_contracts');

const TokenFarm = artifacts.require("TokenFarm");
const TfToken = artifacts.require("TFToken")
const DaiToken = artifacts.require('DaiToken')

require('chai').use(require('chai-as-promised')).should()

function tokens(n){
    return  web3.utils.toWei(n,'Ether')
}

contract('TokenFarm', ([owner,investor]) => {
    let daiToken, tfToken, tokenFarm

    before(async() => {
        // Load Contracts
        daiToken = await DaiToken.new()
        tfToken = await TfToken.new()
        tokenFarm = await TokenFarm.new(tfToken.address,daiToken.address)

        // Transfer all TfToken to farm (1 million)
        await tfToken.transfer(tokenFarm.address, tokens('1000000'))

        // Send token to investors
        await daiToken.transfer(investor, tokens('100'), {from:owner})
    })


    describe("Mock Dai Deployment", async () => {
        it('has a name', async() => {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })

    describe("Tf Token Deployment", async () => {
        it('has a name', async() => {
            const name = await tfToken.name()
            assert.equal(name, 'Mock TF Token')
        })
    })

    describe("Token Farm Deployment", async () => {
        it('has a name', async() => {
            const name = await tokenFarm.name()
            assert.equal(name, 'PTF TokenFarm')
        })
        it('contract has tokens', async() => {
            let balance = await tfToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(),tokens('1000000'))
        })
    })

    describe('Farming tokens', async() => {
        it('rewards investors for staking mDai tokens', async() => {
            let result

            // Check investor balnace for staking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(),tokens('100'), 'investor Mock DAI wallet balance correct before staking')

            // Aprove
            await daiToken.approve(tokenFarm.address,tokens('100'), {from:investor})

            // Stake Mock DAI tokens
            await tokenFarm.stakeTokens(tokens('100'), {from: investor})

            // Check staking result
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking')

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking')

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

            // Issue Tokens
            await tokenFarm.issueTokens({from: owner})

            // Check balances after issurance
            result = await tfToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Tf Token wallet balance correct affter issuance')

            // Ensure that only onwer can issue tokens
            await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

            // Unstake tokens
            await tokenFarm.unstakeTokens({ from: investor })

            // Check results after unstaking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking')

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
        })
    })
})