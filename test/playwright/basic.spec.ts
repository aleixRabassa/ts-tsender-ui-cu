import basicSetup from '../wallet-setup/basic.setup'
import { testWithSynpress } from '@synthetixio/synpress'
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright'
// import { anvil1Address, anvil2Address, mockTokenAddress, oneAmount } from '../test-constants'

// Set up the test environment with Synpress and MetaMask fixtures, using the basic setup configuration
const test = testWithSynpress(metaMaskFixtures(basicSetup))

const { expect } = test

// test('should ask to connect wallet if not connected', async ({ page }) => {
//   await page.goto('/');
//   await expect(page.getByText("Please connect your wallet...")).toBeVisible()
// });

test('wallet connection should work', async ({ context, page, metamaskPage, extensionId }) => {
  
  // Create a new MetaMask instance with the provided context, page, password, and extension ID
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId)

  // Click the connect button to initiate the wallet connection
  await page.getByTestId("rk-connect-button").click();
  await page.getByTestId("rk-wallet-option-metaMask").waitFor({
    state: "visible",
    timeout: 30000
  });

  await page.getByTestId('rk-wallet-option-metaMask').click();
  await metamask.connectToDapp();
});

/*
test('should show airdrop form when wallet is connected', async ({ context, page, metamaskPage, extensionId }) => {
  
  // Create a new MetaMask instance with the provided context, page, password, and extension ID
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId)

  // Click the connect button to initiate the wallet connection
  await page.getByTestId("rk-connect-button").click();
  await page.getByTestId("rk-wallet-option-metaMask").waitFor({
    state: "visible",
    timeout: 30000
  });

  await page.getByTestId('rk-wallet-option-metaMask').click();
  await metamask.connectToDapp();

  // const customNetwork = {
  //   name: "Anvil",
  //   rpcUrl: "http://localhost:8545",
  //   chainId: 31337,
  //   symbol: "ETH"
  // };
  // await metamask.addNetwork(customNetwork);

  // await expect(page.getByText("Token Address")).toBeVisible()
});

test('should show mock token if token address is provided', async ({ context, page, metamaskPage, extensionId }) => {
  
  // Create a new MetaMask instance with the provided context, page, password, and extension ID
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId)

  // Click the connect button to initiate the wallet connection
  await page.getByTestId("rk-connect-button").click();
  await page.getByTestId("rk-wallet-option-metaMask").waitFor({
    state: "visible",
    timeout: 30000
  });

  await page.getByTestId('rk-wallet-option-metaMask').click();
  await metamask.connectToDapp();

  // const customNetwork = {
  //   name: "Anvil",
  //   rpcUrl: "http://localhost:8545",
  //   chainId: 31337,
  //   symbol: "ETH"
  // };
  // await metamask.addNetwork(customNetwork);

  // await expect(page.getByText("Token Address")).toBeVisible()
});
/*