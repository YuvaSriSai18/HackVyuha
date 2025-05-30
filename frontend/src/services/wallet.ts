import { ethers } from "ethers";

export function getProvider(): ethers.providers.Web3Provider {
  return new ethers.providers.Web3Provider(window.ethereum);
}

export async function getSigner() {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}
