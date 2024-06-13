import { init } from '@airstack/node';
import { config } from 'dotenv';
import {
  getCastsByChannel,
  getChannelsCreatedByAnAddress,
  getWeeklyCastsCount,
} from './services/channels';

config();
export class LaunchboxClass {
  constructor() {}

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
}

async function initialize() {
  // initialize the airstack sdk
  init(process.env.TEST_AIRSTACK_KEYS);
  const launchbox = new LaunchboxClass();

  return launchbox;
}

const Launchbox = {
  initialize,
};

export default Launchbox;
