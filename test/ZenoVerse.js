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
    const uri = "https://api.zenoverse.com/token/0";
    const tx = await zenoverse.mintObservation(owner.address, uri);
    const receipt = await tx.wait();
    const observationEvent = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "ObservationMinted"
    );
    const tokenId = observationEvent.args.tokenId;
    const metadata = await zenoverse.getObservationMetadata(tokenId);
    expect(metadata).to.equal(uri);
  });

  it("should revert the get metadata call if tokenId does not exist", async function () {
    await expect(zenoverse.getObservationMetadata(0)).to.be.revertedWith(
      "ZenoVerse: Metadata query for nonexistent token"
    );
  });

  it("should mint a token and emit event", async function () {
    const uri = "https://api.zenoverse.com/token/1";
    const tx = await zenoverse.mintObservation(addr1.address, uri);
    const receipt = await tx.wait();

    expect(receipt.status).to.equal(1);

    const observationEvent = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "ObservationMinted"
    );

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

  it("should return all the tokenIds owned by the user", async function () {
    await zenoverse.mintObservation(addr1.address, "ipfs://token1");
    await zenoverse.mintObservation(addr1.address, "ipfs://token2");
    await zenoverse.mintObservation(addr1.address, "ipfs://token3");

    const tokens = await zenoverse.getAllTokensByOwner(addr1.address);
    const tokenIds = tokens.map((id) => Number(id));
    expect(tokenIds).to.have.members([1, 2, 3]);
  });

  it("should revert if user address is zero", async function () {
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

    await expect(
      zenoverse.getAllTokensByOwner(ZERO_ADDRESS)
    ).to.be.revertedWith("ZenoVerse: Owner cannot be the zero address");
  });

  it("should allow the owner to set token URI", async function () {
    await zenoverse.mintObservation(addr1.address, "ipfs://original.json");
    const newURI = "ipfs://updated.json";
    await zenoverse.setTokenURI(1, newURI);

    const updatedURI = await zenoverse.getObservationMetadata(1);
    expect(updatedURI).to.equal(newURI);
  });

  it("should revert if non-owner tries to set token URI", async function () {
    await zenoverse.mintObservation(addr1.address, "ipfs://original.json");
    const hackerURI = "ipfs://hacked.json";

    await expect(
      zenoverse.connect(addr1).setTokenURI(1, hackerURI)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
