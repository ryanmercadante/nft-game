import { ethers } from "hardhat";

async function main() {
  // We get the contract to deploy
  const gameContractFactory = await ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy(
    ["Gilgamesh", "Rem", "Jpop"], // Names
    [
      "QmeHdzZrMUWK3xyAt4aWuKBQCrMzi3PRHBmk2WXK2LNftS", // Images
      "QmVW3a5SGCEMy9EKyih8nRWjVdWHEhaH13sdqgDyNqoMXQ",
      "QmY5yWxeNifeatGGH4KSRTzND5iewRf6oJrvj5rp162Xr8",
    ],
    [100, 200, 1], // HP values
    [150, 100, 5000], // Attack damage values
    "Madara", // Boss name
    "QmXqk3YGNJgtMyA662vLn21UJN2VTPbN6FFeSy8YeYQkyw", // Boss image
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
