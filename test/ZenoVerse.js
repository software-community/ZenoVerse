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
    
});

