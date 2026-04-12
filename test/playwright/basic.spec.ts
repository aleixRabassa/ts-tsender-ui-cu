import basicSetup from '../wallet-setup/basic.setup';
import { testWithSynpress } from '@synthetixio/synpress';
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright';

const test = testWithSynpress(metaMaskFixtures(basicSetup))
const { expect } = test;

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle("TSender");
});