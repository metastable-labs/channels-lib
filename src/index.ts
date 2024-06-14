import { init } from '@airstack/node';
import { getCastsByChannel, getChannelsCreatedByAnAddress, getWeeklyCastsCount } from './query/channels';
import { getParticipantTokenBalances } from './query/token';

export default class Launchbox {
  constructor(key: string, env: 'dev' | 'prod' = 'prod') {
    init(key, env);
  }
  public async getChannelsByUserAddress(owner: `0x${string}`) {
    const result = await getChannelsCreatedByAnAddress(owner);
    return result;
  }
  public async getCasts(channelUrl: string) {
    const result = await getCastsByChannel(channelUrl);

    return result;
  }
  public async getNumberOfWeeklyCasts(channelUrl: string) {
    const result = await getWeeklyCastsCount(channelUrl);
    return result;
  }

  public async getParticipantTokenBalances(channelName: string, tokenAddress: `0x${string}`) {
    const result = await getParticipantTokenBalances({ channelName, tokenAddress })
    return result
  }
}

