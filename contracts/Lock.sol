// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";


contract Lock {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(uint amount, uint when);

    // NFT logic
    uint256 private _tokenIdCounter;

    // Event for frontend notification
    event ObservationMinted(address indexed to, uint256 indexed tokenId, string tokenURI);

    // Mapping from tokenId to tokenURI
    mapping(uint256 => string) private _tokenURIs;

    // Mapping from owner to list of owned token IDs
    mapping(address => uint256[]) private _ownedTokens;

    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }

    // mintObservation() restricted to backend (onlyOwner)
    function mintObservation(address to, string memory tokenURI) external {
        require(msg.sender == owner, "Only owner can mint");
        uint256 tokenId = ++_tokenIdCounter;
        _tokenURIs[tokenId] = tokenURI;
        _ownedTokens[to].push(tokenId);
        emit ObservationMinted(to, tokenId, tokenURI);
    }

    //  ObservationMinted event for frontend notification (already emitted in mintObservation)

    
}