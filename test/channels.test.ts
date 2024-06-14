import { config } from 'dotenv';
import Launchbox from '../src';

config();

describe('Launchbox SDK Test', () => {
  let launchbox = new Launchbox(process.env.TEST_AIRSTACK_KEYS!, "dev");

  let owner = '0x459D7FB72ac3dFB0666227B30F25A424A5583E9c';
  let channelUrl = 'https://warpcast.com/~/channel/gmism';


  it('should get channel data by creators', async () => {
    const response = await launchbox.getChannelsByUserAddress(owner as `0x${string}`);
    console.log(response.data.FarcasterChannels.FarcasterChannel);
    expect(response).toBeDefined();
  }, 200000);

  it('should get casts in a particular channel', async () => {
    const response = await launchbox.getCasts(channelUrl);
    console.log(response);
    expect(response).toBeDefined();
  }, 200000);

  it('should get number of weekly casts in a particular channel', async () => {
    const response = await launchbox.getNumberOfWeeklyCasts(channelUrl);
    console.log(response);
    expect(response).toBeDefined();
  }, 200000);
});
