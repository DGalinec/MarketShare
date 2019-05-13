import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
const { expect, assert } = chai

var MarketShare = artifacts.require("MarketShare");

contract('Testing MarketShare contract', function(accounts) {
  let marketshare;
  const account0 = accounts[0];
  const account1 = accounts[1];
  const account2 = accounts[2];

  it(' should be able to deploy the MarketShare contract and check if the contract onwer is account[0]', async () => {
    marketshare = await MarketShare.new();

    expect(await marketshare.owner()).to.equal(account0);
  })
})