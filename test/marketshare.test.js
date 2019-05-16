import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
const { expect, assert } = chai

var MarketShare = artifacts.require("MarketShare");
var Seller = artifacts.require("Seller");

contract('Testing MarketShare contract', function(accounts) {
  let marketshare;
  let contractowner;

  const account0 = accounts[0];
  const account1 = accounts[1];
  const account2 = accounts[2];

  /**
   * @test proper MarketShare contract deployment
   */
  it(' should be able to deploy the MarketShare contract and check if the contract onwer is account[0]', async () => {
    marketshare = await MarketShare.new();
    contractowner = await marketshare.owner();

    expect(await marketshare.owner()).to.equal(account0);
  })

  /**
   * @test if only a listed seller can record sales
   */
  it(' should not let a non listed seller record sales', async () => {
    const _valuesales = 10;
    const _nbsales = (await marketshare.getNbSales()).toNumber();
    const _totalsales = (await marketshare.getTotalSales()).toNumber();
    expect(await marketshare.isSeller(account1)).to.equal(false);
    await expect(marketshare.recordSales(_valuesales, {from: account1})).to.be.rejected;
    expect(await marketshare.isSeller(account1)).to.equal(false);
    expect((await marketshare.getNbSales()).toNumber()).to.equal(_nbsales);
    expect((await marketshare.getTotalSales()).toNumber()).to.equal(_totalsales);
  })

  /**
   * @test if a listed seller can record sales
   */
  it(' should let a listed seller record sales', async () => {
    expect(await marketshare.isSeller(account1)).to.equal(false);
    await marketshare.addSeller(account1, {from: contractowner});
    expect(await marketshare.isSeller(account1)).to.equal(true);

    const _nbsales = (await marketshare.getNbSales()).toNumber();
    const _totalsales = (await marketshare.getTotalSales()).toNumber();
    const _valuesales = 10;
    await marketshare.recordSales(_valuesales, {from: account1});
    expect((await marketshare.getNbSales()).toNumber()).to.equal(_nbsales+1);
    expect((await marketshare.getTotalSales()).toNumber()).to.equal(_totalsales+_valuesales);
    expect((await marketshare.getSales(account1)).toNumber()).to.equal(_valuesales);
  })

  /**
   * @test if an authorised seller cannot enter negative value
   */
  it(' should not let a seller enters a negative sales value', async () => {
    const _valuesales = -10;
    const _totalsales = (await marketshare.getTotalSales()).toNumber();
    const _nbsales = (await marketshare.getNbSales()).toNumber();
    expect(await marketshare.isSeller(account1)).to.equal(true);
    await expect(marketshare.recordSales(_valuesales, {from: account1})).to.be.rejected;
    expect((await marketshare.getTotalSales()).toNumber()).to.equal(_totalsales);
    expect((await marketshare.getNbSales()).toNumber()).to.equal(_nbsales);
  })

  /**
   * @test that a sale record is completely deleted when an authorised seller re-enter zero sales value
   */
  it(' should delete the current sale record when a listed seller re-enters zero sale', async () => {
    const _valuesales = 0;
    const _nbsales = (await marketshare.getNbSales()).toNumber();
    const _totalsales = (await marketshare.getTotalSales()).toNumber();
    const _oldsalesrecord = (await marketshare.getSales(account1)).toNumber();
    expect(await marketshare.isSeller(account1)).to.equal(true);
    await marketshare.recordSales(_valuesales, {from: account1});
    expect((await marketshare.getNbSales()).toNumber()).to.equal(_nbsales-1);
    expect((await marketshare.getTotalSales()).toNumber()).to.equal(_totalsales-_oldsalesrecord);
    expect((await marketshare.getSales(account1)).toNumber()).to.equal(_valuesales);
  })

  /**
   * @test that nothing is recorded when a Seller starts by entering a zero sales value
   */
  it(' should not record anything when a listed seller starts by entering a zero sales value', async () => {
    expect(await marketshare.isSeller(account2)).to.equal(false);
    await marketshare.addSeller(account2, {from: contractowner});
    expect(await marketshare.isSeller(account2)).to.equal(true);
    expect((await marketshare.getSales(account2)).toNumber()).to.equal(0);

    const _valuesales = 0;
    const _nbsales = (await marketshare.getNbSales()).toNumber();
    const _totalsales = (await marketshare.getTotalSales()).toNumber();
    await marketshare.recordSales(_valuesales, {from: account2});
    expect((await marketshare.getNbSales()).toNumber()).to.equal(_nbsales);
    expect((await marketshare.getTotalSales()).toNumber()).to.equal(_totalsales);
    expect((await marketshare.getSales(account2)).toNumber()).to.equal(_valuesales);
  })

  /**
   * @test that contract owner can delete an empty sales record without harming the total sales records
   */
  it(' should not be a problem to empty an already empty sales record', async () => {
    expect(await marketshare.isSeller(account1)).to.equal(true);
    expect((await marketshare.getSales(account1)).toNumber()).to.equal(0);
    const _nbsales = (await marketshare.getNbSales()).toNumber();
    const _totalsales = (await marketshare.getTotalSales()).toNumber();
    await marketshare.deleteSales(account1, {from: contractowner});
    expect((await marketshare.getNbSales()).toNumber()).to.equal(_nbsales);
    expect((await marketshare.getTotalSales()).toNumber()).to.equal(_totalsales);
    expect((await marketshare.getSales(account1)).toNumber()).to.equal(0);
  })

  /**
   * @test that contract owner can empty a non empty sales record
   */
  it(' should let contract owner to empty a non empty sales record', async () => {
    expect(await marketshare.isSeller(account1)).to.equal(true);
    expect((await marketshare.getSales(account1)).toNumber()).to.equal(0);
    const _nbsales = (await marketshare.getNbSales()).toNumber();
    const _totalsales = (await marketshare.getTotalSales()).toNumber();
    const _valuesales = 10;
    await marketshare.recordSales(_valuesales, {from: account1});
    expect((await marketshare.getSales(account1)).toNumber()).to.gt(0);
    await marketshare.deleteSales(account1, {from: contractowner});
    expect((await marketshare.getNbSales()).toNumber()).to.equal(_nbsales);
    expect((await marketshare.getTotalSales()).toNumber()).to.equal(_totalsales);
    expect((await marketshare.getSales(account1)).toNumber()).to.equal(0);
  })


  /**
   * @test that only contract owner can use the deleteSales function
   */
  it(' should not let someone else than the contract owner to activate the deleteSales function', async () => {
    expect(await marketshare.isSeller(account1)).to.equal(true);
    const _valuesales = 10;
    await marketshare.recordSales(_valuesales, {from: account1});
    await expect(marketshare.deleteSales(account1, {from: account2})).to.be.rejected;
    expect((await marketshare.getSales(account1)).toNumber()).to.equal(_valuesales);
  })
})