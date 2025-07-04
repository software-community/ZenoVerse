// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ZenoVerse is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping (uint256 => address) private _observationOwners;

    constructor() ERC721("ZenoVerse", "ZV") {
        _observationOwners[1] = address(0x1234567890123456789012345678901234567890);
        _observationOwners[2] = address(0x0987654321098765432109876543210987654321);
        _observationOwners[3] = address(0x1122334455667788990011223344556677889900);
        _observationOwners[4] = address(0x2233445566778899001122334455667788990011);
        _observationOwners[5] = address(0x3344556677889900112233445566778899001122);
    }

    // mintObservation()

    //  getObservationMetadata(tokenId)

    // getAllTokensByOwner()

    // setTokenURI() 

    // event ObservationMinted
}