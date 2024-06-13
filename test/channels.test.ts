import { config } from 'dotenv';
import Launchbox, { LaunchboxClass } from '../src';

config();

describe('Launchbox SDK Test', () => {
  let launchbox: LaunchboxClass;
  let owner = '0x459D7FB72ac3dFB0666227B30F25A424A5583E9c';

  beforeAll(async () => {
    launchbox = await Launchbox.initialize();
  }, 200000);
  it('should get channel data by creators', async () => {
    const response = await launchbox.getChannelsByUserAddress(owner as `0x${string}`);
    console.log(response);
    expect(response).toBeDefined();
  }, 200000);
});
