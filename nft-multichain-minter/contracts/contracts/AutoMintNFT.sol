//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20

import "@openzepplin/contracts/token/ERC721/extension/ERC721URIStorage.sol"
import "@openzepplin/contracts/access/Ownable.sol";

contract Automint is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    constructor(string name, string memory symbol)ERC721(name,symbol)
        Ownable(msg.sender){}

    function mintTo(address to, string memory tokenURI) public returns (unit256) {
        _tokenIds += 1;
        uint newId = tokenId;

        _mint(to. newId);
        _setTokenURI(newId, tokenURI);

        return newId;
    }
}