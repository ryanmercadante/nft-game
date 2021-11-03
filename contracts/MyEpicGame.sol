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
        uint256 characterIndex;
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;

    CharacterAttributes[] public defaultCharacters;

    // We create a mapping from the nft's tokenId => that NFTs attributes.
    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

    struct BigBoss {
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }

    BigBoss public bigBoss;

    // A mapping from an address => the NFTs tokenId.
    mapping(address => uint256) public nftHolders;

    // Events
    event CharacterNftMinted(address sender, uint256 tokenId, uint256 characterIndex);
    event AttackCompleted(uint256 newBossHp, uint256 newPlayerHp);

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint256[] memory characterHp,
        uint256[] memory characterAttackDmg,
        string memory bossName,
        string memory bossImageURI,
        uint256 bossHp,
        uint256 bossAttackDamage
    ) ERC721("Heroes", "HERO") {
            bigBoss = BigBoss({
                name: bossName,
                imageURI: bossImageURI,
                hp: bossHp,
                maxHp: bossHp,
                attackDamage: bossAttackDamage
            });

            console.log("Done initializing boss %s w/ HP %s, img %s", bigBoss.name, bigBoss.hp, bigBoss.imageURI);

            for(uint256 i = 0; i < characterNames.length; i += 1) {
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

        emit CharacterNftMinted(msg.sender, newItemId, _characterIndex);
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
                        "\", \"description\": \"This is an NFT that lets people play in the game Metaverse Slayer!\", \"image\": \"ipfs://",
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

    function attackBoss() public {
        // Get the state of the player's NFT.
        uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
        CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];

        console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
        console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);

        // Make sure the player has more than 0 HP.
        require(player.hp > 0, "Error: character has 0 HP.");

        // Make sure the boss has more than 0 HP.
        require(bigBoss.hp > 0, "Error: boss has 0 HP.");

        // Allow player to attack boss.
        if (bigBoss.hp < player.attackDamage) {
            bigBoss.hp = 0;
        } else {
            bigBoss.hp = bigBoss.hp - player.attackDamage;
        }

        // Allow boss to attack player.
        if (player.hp < bigBoss.attackDamage) {
            player.hp = 0;
        } else {
            player.hp = player.hp - bigBoss.attackDamage;
        }

        console.log("Boss attacked player. New player HP: %s\n", player.hp);

        emit AttackCompleted(bigBoss.hp, player.hp);
    }

    function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
        // Get the tokenId of the user's character NFT.
        uint256 userNftTokenId = nftHolders[msg.sender];

        // If the user has a tokenId in the map, return their character.
        if (userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        }

        // Else, return an empty character.
        CharacterAttributes memory emptyStruct;
        return emptyStruct;
    }

    function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
        return defaultCharacters;
    }

    function getBigBoss() public view returns (BigBoss memory) {
        return bigBoss;
    }
}
