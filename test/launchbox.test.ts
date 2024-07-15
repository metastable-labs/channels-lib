import { config } from 'dotenv';
import Launchbox from '../src';
import { Cast, Channel, Participant } from '../src/types';

config();

describe('Launchbox SDK Test', () => {
  let launchbox: Launchbox;
  const owner = '0x459D7FB72ac3dFB0666227B30F25A424A5583E9c';
  const channelName = 'gmism';
  const channelToken = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85';

  beforeAll(() => {
    launchbox = new Launchbox(process.env.TEST_AIRSTACK_KEYS!, 'dev');
  });

  describe('getChannelsByUserAddress', () => {
    it('should fetch channels for a user', async () => {
      const channels: Channel[] = await launchbox.getChannelsByUserAddress(owner);
      expect(channels).toBeDefined();
      expect(channels.length).toBeGreaterThan(0);
    });

    it('should handle errors when fetching channels', async () => {
      await expect(launchbox.getChannelsByUserAddress('0xinvalid_address')).rejects.toThrow();
    });
  });

  describe('getChannelCasts', () => {
    it('should fetch casts from a channel', async () => {
      const casts: Cast[] = await launchbox.getChannelCasts(channelName);
      expect(casts).toBeDefined();
      expect(casts.length).toBeGreaterThanOrEqual(4);
    }, 20000);

    it('should fetch casts with a limit and date filter', async () => {
      const date = new Date('2024-06-01');
      const casts: Cast[] = await launchbox.getChannelCasts(channelName, 10, date);
      expect(casts).toBeDefined();
    }, 20000);
  });

  describe('getChannelSocialCapital', () => {
    it('should calculate social capital for a channel', async () => {
      const score: number = await launchbox.getChannelSocialCapital(channelName, channelToken);
      expect(score).toBeDefined();
    }, 20000);
  });

  describe('getChannelParticipants', () => {
    it('should fetch participants for a channel', async () => {
      const participants: Participant[] = await launchbox.getChannelParticipants(channelName);

      expect(participants).toBeDefined();
      const testUser = participants.find((p) => p.profileName === 'noelukwa');
      expect(testUser).toBeDefined();
      expect(testUser?.addresses.length).toBeGreaterThanOrEqual(1);
    }, 20000);
  });
});
