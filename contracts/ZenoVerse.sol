// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZenoVerse is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // To store the tokens owned by an address
    mapping(address => uint256[]) private _ownedObservations;

    // event ObservationMinted
    event ObservationMinted(
        address indexed to,
        uint256 indexed tokenId,
        string tokenURI
    );

    // mintObservation()
    function mintObservation(
        address to,
        string memory uri
    ) public onlyOwner returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _ownedObservations[to].push(tokenId);
        emit ObservationMinted(to, tokenId, uri);
        return tokenId;
    }

    // getObservationMetadata(tokenId)
    function getObservationMetadata(
        uint256 tokenId
    ) public view returns (string memory) {
        require(
            _exists(tokenId),
            "ZenoVerse: Metadata query for nonexistent token"
        );
        return tokenURI(tokenId);
    }

    // getAllTokensByOwner()
    function getAllTokensByOwner(
        address owner
    ) external view returns (uint256[] memory) {
        require(
            owner != address(0),
            "ZenoVerse: Owner cannot be the zero address"
        );
        return _ownedObservations[owner];
    }

    /// @notice Burns a token in case of abuse or invalid data (admin only)
    function burn(uint256 tokenId) public onlyOwner {
        address owner = ownerOf(tokenId);
        _burn(tokenId);

        // Clean up from owner's token list
        uint256[] storage tokens = _ownedObservations[owner];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
    }

    /// @notice Allows the backend to update a token URI
    function setTokenURI(uint256 tokenId, string memory newURI) public onlyOwner {
        require(_exists(tokenId), "ZenoVerse: Token does not exist");
        _setTokenURI(tokenId, newURI);
    }

}
