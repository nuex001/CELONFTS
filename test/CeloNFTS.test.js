const { deployments, getNamedAccounts } = require("hardhat");
const { expect, assert } = require("chai");

describe("CeloNFTS", () => {
  let celoNfts;
  let deployer;
  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]); // Deploys all contracts in the fixture
    celoNfts = await ethers.getContract("CeloNFTS", deployer);
  })


  describe("COHORT", async () => {
    it("owner should be able to add cohort", async () => {
      const nftDetailsArray = [
        {
          student: deployer,
          name: "Alice",
          image: "alice.jpg",
          cohort: 1,
          added: false,
        },
        {
          student: deployer,
          name: "Bob",
          image: "bob.jpg",
          cohort: 1,
          added: false,
        },
      ];
      const response = await celoNfts.addCohort(nftDetailsArray);
      await expect(response).to.emit(celoNfts, "AddedNewCohort");
    });
    it("another user should be able to add cohort", async () => {
      const nftDetailsArray = [
        {
          student: deployer,
          name: "Alice",
          image: "alice.jpg",
          cohort: 1,
          added: false,
        },
        {
          student: deployer,
          name: "Bob",
          image: "bob.jpg",
          cohort: 1,
          added: false,
        },
      ];
      const [owner, addr1] = await ethers.getSigners();
      try {
        const response = await celoNfts.connect(addr1).addCohort(nftDetailsArray);
        assert.fail('Expected revert not received');
      } catch (error) {
        expect(error.message).to.include("OwnableUnauthorizedAccount")
      }

    });
  });

  describe("ADD COHORT", async () => {
    it("CAN MINT", async () => {
      const nftDetailsArray = [
        {
          student: deployer,
          name: "Alice",
          image: "alice.jpg",
          cohort: 4,
          added: false,
        },
        {
          student: deployer,
          name: "Bob",
          image: "bob.jpg",
          cohort: 4,
          added: false,
        },
      ];
      await celoNfts.addCohort(nftDetailsArray);
      const response = await celoNfts.mint();
      const SUPPLY = await celoNfts.totalSupply();
      expect(Number(SUPPLY), 1);
    });
    it("CANNOT MINT CAUSE because you weren't added", async () => {
      const nftDetailsArray = [
        {
          student: deployer,
          name: "Alice",
          image: "alice.jpg",
          cohort: 4,
          added: false,
        },
        {
          student: deployer,
          name: "Bob",
          image: "bob.jpg",
          cohort: 4,
          added: false,
        },
      ];
      await expect(celoNfts.mint()).to.be.revertedWith(
        "None Available for this address"
      );
    });

  });
})