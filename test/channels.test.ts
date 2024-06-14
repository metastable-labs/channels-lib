import { config } from 'dotenv';
import Launchbox from '../src';

config();

describe('Launchbox SDK Test', () => {
  let launchbox = new Launchbox(process.env.TEST_AIRSTACK_KEYS!, "dev");
  let owner = '0x459D7FB72ac3dFB0666227B30F25A424A5583E9c';
  let channelUrl = 'https://warpcast.com/~/channel/gmism';


  it('should get channel data by creators', async () => {
    const response = await launchbox.getChannelsByUserAddress(owner as `0x${string}`);
    expect(response.FarcasterChannels).toBeDefined();
    expect(response.FarcasterChannels.FarcasterChannel.length).toBeGreaterThanOrEqual(1)
  }, 200000);

  it('should get casts in a particular channel', async () => {
    const response = await launchbox.getCasts(channelUrl);
    expect(response.length).toBeGreaterThanOrEqual(2);
  }, 200000);

  it('should get number of weekly casts in a particular channel', async () => {
    const response = await launchbox.getNumberOfWeeklyCasts(channelUrl);
    expect(response).toBeDefined();
    expect(response).toBeGreaterThan(1)
  }, 200000);

  it('should get channel participants, their social capital and their token balance', async () => {
    let channel = "gmism"
    let chain = "base"

    /**
     * https://basescan.org/token/0x4ed4e862860bed51a9570b96d89af5e1b0efefed
     */

    let channelToken = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed" as `0x${string}`
    const response = await launchbox.getChannelSocialCapital(channel, chain, channelToken)
    expect(response).toBeDefined();
  })

  it('should get token balances of channel participants', async () => {
    let channelName = "gmism"
    /**
     * https://basescan.org/token/0x4ed4e862860bed51a9570b96d89af5e1b0efefed
     */

    let tokenAddress = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed" as `0x${string}`
    const response = await launchbox.getParticipantTokenBalances({ channelName, tokenAddress })
    expect(response).toBeDefined();
  })

});
