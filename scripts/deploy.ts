import { ethers } from "hardhat";

async function main() {
  // We get the contract to deploy
  const gameContractFactory = await ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy(
    ["Gilgamesh", "Rem", "Jpop"], // Names
    [
      "https://wallpapercave.com/wp/wp2085349.jpg", // Images
      "https://i.redd.it/strg79a0b1611.png",
      "https://media-exp1.licdn.com/dms/image/C4D03AQEJtGbbESjEQA/profile-displayphoto-shrink_800_800/0/1525376249105?e=1640822400&v=beta&t=9zpiZXIrnjFR_Fh8Ss1U_4-7MNIlzfkdRUXeE31BdKA",
    ],
    [100, 200, 1], // HP values
    [150, 100, 5000], // Attack damage values
    "Madara", // Boss name
    "https://yt3.ggpht.com/a-/AAuE7mD0hQWz2FowR3UlYLU48EpvdnfTI4cB-62QUg=s900-mo-c-c0xffffffff-rj-k-no", // Boss image
    10000, // Boss hp
    50 // Boss attack damage
  );

  await gameContract.deployed();

  console.log("Contract deployed to:", gameContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
