const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZenoVerse", function () {
  let ZenoVerse, zenoverse, owner, addr1, addr2;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    ZenoVerse = await ethers.getContractFactory("ZenoVerse");
    zenoverse = await ZenoVerse.deploy();
  });

  
  it("should deploy and set the owner", async function () {
    expect(await zenoverse.owner()).to.equal(owner.address);
  });


  it("should get the correct token metadata", async function () {
    // Mint a token first
    const uri = "https://api.zenoverse.com/token/0";
    const tx = await zenoverse.mintObservation(owner.address, uri);
    const receipt = await tx.wait();
    expect(receipt.logs).to.not.be.empty;
    const observationEvent = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "ObservationMinted"
    );
    expect(observationEvent).to.not.be.undefined;
    const tokenId = observationEvent.args.tokenId;
    // Now check getObservationMetadata
    const metadata = await zenoverse.getObservationMetadata(tokenId);
    expect(metadata).to.equal(uri);
  });


  it("should revert the get metadata call if tokenId does not exist", async function () {
    const tokenId = 0;
    await expect(zenoverse.getObservationMetadata(tokenId)).to.be.revertedWith(
      "ZenoVerse: Metadata query for nonexistent token"
    );
  });

});
