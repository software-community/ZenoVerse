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
    
});