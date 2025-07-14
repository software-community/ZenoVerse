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
  
  it("should mint a token and emit event", async function () {
    const uri = "https://api.zenoverse.com/token/1";
    const tx = await zenoverse.mintObservation(addr1.address, uri);
    const receipt = await tx.wait();
    
    expect(receipt.status).to.equal(1);
    
    const observationEvent = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "ObservationMinted"
    );
    expect(observationEvent).to.not.be.undefined;
    
    expect(observationEvent.args.to).to.equal(addr1.address);
    expect(observationEvent.args.tokenURI).to.equal(uri);
    
    const tokenId = observationEvent.args.tokenId;
    
    expect(await zenoverse.ownerOf(tokenId)).to.equal(addr1.address);
    expect(await zenoverse.tokenURI(tokenId)).to.equal(uri);
    
    const ownedTokens = await zenoverse.getAllTokensByOwner(addr1.address);
    expect(ownedTokens).to.include(tokenId);
  });

  it("should revert a mint request that is not sent by owner", async function () {
    const uri = "https://api.zenoverse.com/token/unauthorized";
    
    await expect(
      zenoverse.connect(addr1).mintObservation(addr1.address, uri)
    ).to.be.revertedWith("Ownable: caller is not the owner");
    
    await expect(
      zenoverse.connect(addr2).mintObservation(addr2.address, uri)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

});