import { config } from 'dotenv';
import Launchbox from '../src';

config();

describe('Launchbox SDK Test', () => {
  let launchbox = new Launchbox(process.env.TEST_AIRSTACK_KEYS!, 'dev');
  let owner = '0x459D7FB72ac3dFB0666227B30F25A424A5583E9c';

  it('should get channel data by creators', async () => {
    const response = await launchbox.getChannelsByUserAddress(owner as `0x${string}`);
    expect(response.FarcasterChannels).toBeDefined();
    expect(response.FarcasterChannels.FarcasterChannel.length).toBeGreaterThanOrEqual(1);
  }, 200000);

  it('should get limited channel data by creator', async () => {
    const response = await launchbox.getChannelsByUserAddress(owner as `0x${string}`, 1);
    expect(response.FarcasterChannels).toBeDefined();
    expect(response.FarcasterChannels.FarcasterChannel.length).toBe(1);
  }, 200000);
});
