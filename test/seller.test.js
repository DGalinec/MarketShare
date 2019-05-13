import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
const { expect, assert } = chai

var Seller = artifacts.require("Seller");

contract('Testing Seller contract', function(accounts) {
  let seller;
  const account0 = accounts[0];
  const account1 = accounts[1];
  const account2 = accounts[2];

  it(' should be able to deploy the Seller contract and check if the contract onwer is account[0]', async () => {
    seller = await Seller.new();

    expect(await seller.owner()).to.equal(account0);
  })

  /**
   * @test the addSeller(address) function
   * contract owner can add a new seller address and total number of sellers is properly incremented
   */
  it(' should let contract owner to add a new seller and increment the number of sellers', async () => {
    const nb = (await seller.getNbSellers()).toNumber();
    expect(await seller.isSeller(account1)).to.equal(false);
    await seller.addSeller(account1, {from: accounts[0]});

    expect(await seller.isSeller(account1)).to.equal(true);
    expect((await seller.getNbSellers()).toNumber()).to.equal(nb+1);
  })

  /**
   * @test the addSeller(address) function
   * ONLY contract owner can add a new seller address
   */
  it(' should not let an account other than the owner create a new seller and increment the number of sellers', async () => {
    const nb = (await seller.getNbSellers()).toNumber();
    expect(await seller.isSeller(account2)).to.equal(false);
    await expect(seller.addSeller(account2, {from: account1})).to.be.rejected;
    expect((await seller.getNbSellers()).toNumber()).to.equal(nb);
  })

  /**
   * @test the addSeller(address) function
   * a seller address can only be added ONCE
   */
  it(' should not create a new seller in the list if seller address already exists', async () => {
    expect(await seller.isSeller(account1)).to.equal(true);
    await expect(seller.addSeller(account1, {from: account0})).to.be.rejected;
  })

  /**
   * @test the deleteSeller(address) function
   * contract owner can delete a seller address and total number of sellers is properly decremented
   */
  it(' should allow the contract owner to remove a seller and decrement the number of sellers', async () => {
    const nb = (await seller.getNbSellers()).toNumber();
    expect(await seller.isSeller(account2)).to.equal(false);
    await seller.addSeller(account2, {from: accounts[0]});
    expect(await seller.isSeller(account2)).to.equal(true);
    expect((await seller.getNbSellers()).toNumber()).to.equal(nb+1);

    await seller.deleteSeller(account2, {from: accounts[0]});
    expect(await seller.isSeller(account2)).to.equal(false);
    expect((await seller.getNbSellers()).toNumber()).to.equal(nb);
  })

  /**
   * @test the deleteSeller(address) function
   * ONLY contract owner can delete a seller address
   */
  it(' should not let an account other than the owner remove a seller and decrement the number of sellers', async () => {
    const nb = (await seller.getNbSellers()).toNumber();
    expect(await seller.isSeller(account1)).to.equal(true);
    await expect(seller.deleteSeller(account1, {from: account1})).to.be.rejected;
    expect((await seller.getNbSellers()).toNumber()).to.equal(nb);
  })

  /**
   * @test the deleteSeller(address) function
   * only an existing seller address can be deleted
   */
  it(' should delete a seller address in the list only if the seller address exists', async () => {
    const nb = (await seller.getNbSellers()).toNumber();
    expect(await seller.isSeller(account2)).to.equal(false);
    await expect(seller.deleteSeller(account2, {from: account0})).to.be.rejected;
    expect((await seller.getNbSellers()).toNumber()).to.equal(nb);
  })
})