const MarketShare = artifacts.require("./MarketShare.sol");

module.exports = async function(deployer) {
  await deployer.deploy(MarketShare)
  const marketshare = await MarketShare.deployed()
};