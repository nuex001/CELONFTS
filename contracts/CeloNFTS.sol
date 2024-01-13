// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract CeloNFTS is
    ERC721,
    Ownable // Inherit from Ownable
{
    event AddedNewCohort();

    struct nftDetails {
        address student;
        string name;
        string image;
        string cohort;
        bool added;
    }
    uint256 public totalSupply;
    mapping(address => nftDetails) private nfts;
    mapping(uint256 => nftDetails) private mintedNfts;

    constructor(
        address initialOwner
    ) ERC721("CeloNFTS", "CEP") Ownable(initialOwner) {}

    function mint() external {
        nftDetails memory nft = nfts[msg.sender];
        require(nft.added, "None Available for this address");
        nfts[msg.sender].added = false;
        uint256 tokenId = totalSupply;
        _safeMint(msg.sender, tokenId);
        mintedNfts[tokenId] = nft;
        totalSupply++;
    }

    function addCohort(nftDetails[] memory _nftDetails) external onlyOwner {
        require(_nftDetails.length > 0, "Array is empty");
        for (uint32 i = 0; i < _nftDetails.length; i++) {
            require(
                !_nftDetails[i].added,
                "Already added, go mint your certificate"
            );
            _nftDetails[i].added = true;
            nfts[_nftDetails[i].student] = _nftDetails[i];
        }
        emit AddedNewCohort();
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            balanceOf(ownerOf(tokenId)) > 0,
            "ERC721Metadata: URI query for nonexistent token"
        );
        nftDetails memory data = mintedNfts[tokenId];
        // Encode the data as a JSON string
     string memory json = string(
        abi.encodePacked(
            "{",
              '"collection_name":"cohort', data.cohort, '",',
            '"name":"', data.name, '",',
            '"description":"', data.name, ' Graduated from cohort', data.cohort, '",',
            '"image":"', data.image, '"',
            "}"
        )
    );

        json = string(abi.encodePacked(json));

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(bytes(json))
                )
            );
    }

    function checkPass() external view returns (nftDetails memory nft) {
        return nfts[msg.sender];
    }
}
