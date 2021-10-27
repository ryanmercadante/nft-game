//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

import "./libraries/Base64.sol";


contract MyEpicGame is ERC721 {
    struct CharacterAttributes {
      uint characterIndex;
      string name;
      string imageURI;
      uint hp;
      uint maxHp;
      uint attackDamage;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;

    CharacterAttributes[] public defaultCharacters;

    // We create a mapping from the nft's tokenId => that NFTs attributes.
    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

    // A mapping from an address => the NFTs tokenId.
    mapping(address => uint256) public nftHolders;

    constructor(
      string[] memory characterNames,
      string[] memory characterImageURIs,
      uint[] memory characterHp,
      uint[] memory characterAttackDmg
    ) ERC721("Heroes", "HERO") {
        for(uint i = 0; i < characterNames.length; i += 1) {
          defaultCharacters.push(CharacterAttributes({
            characterIndex: i,
            name: characterNames[i],
            imageURI: characterImageURIs[i],
            hp: characterHp[i],
            maxHp: characterHp[i],
            attackDamage: characterAttackDmg[i]
          }));

          CharacterAttributes memory c = defaultCharacters[i];
          console.log("Done initializing %s w/ HP %s, img %s", c.name, c.hp, c.imageURI);
        }

        _tokenId.increment();
    }

    // Users will be able to hit this function and get their NFT based
    // on the characterId they send in.
    function mintCharacterNFT(uint256 _characterIndex) external {
      // Get current tokenId (starts with 1 since we incremented in the constructor).
      uint256 newItemId = _tokenId.current();

      // Assign the tokenId to the caller's wallet address.
      _safeMint(msg.sender, newItemId);

      // We map the tokenId => their character attributes.
      nftHolderAttributes[newItemId] = CharacterAttributes({
        characterIndex: _characterIndex,
        name: defaultCharacters[_characterIndex].name,
        imageURI: defaultCharacters[_characterIndex].imageURI,
        hp: defaultCharacters[_characterIndex].hp,
        maxHp: defaultCharacters[_characterIndex].hp,
        attackDamage: defaultCharacters[_characterIndex].attackDamage
      });

      console.log("Minted NFT w/ tokenId %s and characterIndex %s", newItemId, _characterIndex);

      // Keep an easy way to see who owns what NFT.
      nftHolders[msg.sender] = newItemId;

      // Increment the tokenId for the next person that uses it.
      _tokenId.increment();
    }

    function tokenURI(uint256 _tokenID) public view override returns (string memory) {
      CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenID];

      string memory strHp = Strings.toString(charAttributes.hp);
      string memory strMaxHp = Strings.toString(charAttributes.maxHp);
      string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);

      string memory json = Base64.encode(
        bytes(
          string(
            abi.encodePacked(
              "{\"name\": \"",
              charAttributes.name,
              " -- NFT #: ",
              Strings.toString(_tokenID),
              "\", \"description\": \"This is an NFT that lets people play in the game Metaverse Slayer!\", \"image\": \"",
              charAttributes.imageURI,
              "\", \"attributes\": [ { \"trait_type\": \"Health Points\", \"value\": ",strHp,", \"max_value\":",strMaxHp,"}, { \"trait_type\": \"Attack Damage\", \"value\": ",
              strAttackDamage,"} ]}"
            )
          )
        )
      );

      string memory output = string(
        abi.encodePacked("data:application/json;base64,", json)
      );
      
      return output;
    }
}
