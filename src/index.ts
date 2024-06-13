import { init } from '@airstack/node';
import { config } from 'dotenv';
import { getChannelsCreatedByAnAddress } from './services/channels';

config();
export class LaunchboxClass {
  constructor() {}

  public async getChannelsByUserAddress(owner: `0x${string}`) {
    const result = await getChannelsCreatedByAnAddress(owner);

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
