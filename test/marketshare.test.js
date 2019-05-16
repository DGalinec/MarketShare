import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
const { expect, assert } = chai

var MarketShare = artifacts.require("MarketShare");
var Seller = artifacts.require("Seller");

contract('Testing MarketShare contract', function(accounts) {
  let marketshare;

  const account0 = accounts[0];
  const account1 = accounts[1];
  const account2 = accounts[2];

  /**
   * @test proper MarketShare contract deployment
   */
  it(' should be able to deploy the MarketShare contract and check if the contract onwer is account[0]', async () => {
    marketshare = await MarketShare.new();

    expect(await marketshare.owner()).to.equal(account0);
  })

  /**
   * @test if a listed seller can record sales
   */
  it(' a listed seller should be able to record sales', async () => {
    await marketshare.addSeller(account1, {from: accounts[0]});
    expect((await marketshare.getNbSellers()).toNumber()).to.equal(1);
    expect(await marketshare.isSeller(account1)).to.equal(true);

    const _nb = (await marketshare.getNbSales()).toNumber();
    const _amount = (await marketshare.getTotalSales()).toNumber();
    const _value = 10;
    await marketshare.recordSales(_value, {from: account1});
    expect((await marketshare.getNbSales()).toNumber()).to.equal(_nb+1);
    expect((await marketshare.getTotalSales()).toNumber()).to.equal(_amount+_value);
    expect((await marketshare.getSales(account1)).toNumber()).to.equal(_value);
  })

  /**
   * @test if an authorised seller cannot enter negative value
   */
  it(' should not let a seller enters a negative sales value', async () => {
    const _value = -10;
    expect(await marketshare.isSeller(account1)).to.equal(true);
    await expect(marketshare.recordSales(_value, {from: account1})).to.be.rejected;
  })

})