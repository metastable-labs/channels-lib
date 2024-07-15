import { fetchQuery, init } from '@airstack/node';
import {
  ChannelCastsResponse,
  ChannelParticipantsResponse,
  ChannelsByUserResponse,
  getChannelCastsQuery,
  getChannelParticipantsQuery,
  getChannelsByUserQuery,
  getUserInfoQuery,
  UserInfoResponse,
} from './query';
import { Cast, Channel, Participant } from './types';
export * from './types';
export default class Launchbox {
  constructor(key: string, env: 'dev' | 'prod' = 'prod') {
    init(key, env);
  }

  /**
   * Fetches channels associated with a user's address.
   * @param {string} owner - The Ethereum address of the user.
   * @param {number} [limit] - Optional limit for the number of channels to fetch.
   * @returns {Promise<Channel[]>} A promise that resolves to an array of channels associated with the user.
   * @throws Will throw an error if the query fails.
   */
  public async getChannelsByUserAddress(owner: `0x${string}`, limit?: number): Promise<Channel[]> {
    try {
      const {
        data: {
          Socials: { Social: socials },
        },
      }: UserInfoResponse = await fetchQuery(getUserInfoQuery(owner));
      const { data }: ChannelsByUserResponse = await fetchQuery(
        getChannelsByUserQuery(socials[0].profileName, limit),
      );

      // Extract and map channels from the API response to the Channel type
      const channels: Channel[] = data.FarcasterChannels.FarcasterChannel.map((channel) => ({
        createdAtTimestamp: channel.createdAtTimestamp,
        channelId: channel.channelId,
        name: channel.name,
        description: channel.description,
        imageUrl: channel.imageUrl,
        leadIds: channel.leadIds,
        url: channel.url,
        dappName: channel.dappName,
      }));

      return channels;
    } catch (error) {
      throw new Error('Failed to fetch channels created by user');
    }
  }

  /**
   * Fetches casts from a specified channel.
   * @param {string} channelName - The name of the channel to fetch casts from.
   * @param {number} [limit=50] - The maximum number of casts to fetch.
   * @param {Date} startDate - Optional date, Only fetch casts older than the date given
   * @param {Date} endDate - Optional date, Only fetch casts older than the date given
   * @returns {Promise<Cast[]>} A promise that resolves to an array of casts from the channel.
   * @throws Will throw an error if the query fails.
   */
  public async getChannelCasts(
    channelName: string,
    limit?: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Cast[]> {
    try {
      const query = getChannelCastsQuery(channelName, limit, startDate, endDate);
      const response: ChannelCastsResponse = await fetchQuery(query);
      return response.data.FarcasterCasts.Cast;
    } catch (error) {
      throw new Error('Failed to fetch casts from the channel');
    }
  }

  /**
   * Calculates the social capital score of a given channel.
   *
   * This function calculates the social capital score based on the participants' social capital scores,
   * the average engagement of casts in the channel, and the number of token holders in the channel.
   * @param {string} channelName - The name of the channel for which to calculate social capital.
   * @param {`0x${string}`} token - The token address to filter token holders.
   * @returns {Promise<number>} The calculated social capital score.
   * @throws {Error} Throws an error if there is an issue fetching participants or casts.
   */
  public async getChannelSocialCapital(channelName: string, token: `0x${string}`): Promise<number> {
    try {
      const participants = await this.getChannelParticipants(channelName);

      const casts = await this.getChannelCasts(channelName);

      const socialScores = participants.map((p) => {
        return p.socialCapital.socialCapitalScore;
      });

      const averageScore =
        socialScores.reduce((accumulator, currentValue) => accumulator + currentValue, 0) /
        socialScores.length;

      const engagements = casts.map((f) => {
        return f.numberOfLikes;
      });

      const averageEngagement =
        engagements.reduce((acc, curr) => acc + curr, 0) / engagements.length;

      const tokenHolders = participants.filter((participant) => {
        return participant.tokenBalances.some(
          (tokenBalance) =>
            parseFloat(tokenBalance.amount) > 0 &&
            tokenBalance.address.toLowerCase() === token.toLowerCase(),
        );
      });

      const score =
        (tokenHolders.length + averageEngagement * 1000.0 + averageScore * 1000.0) / 500.0;
      return score;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetches the token balances for participants in a given channel.
   * @param {string} channelName - The channel Name.
   * @param {limit?} limit - limit of the query.
   * @returns {Promise<Participant[]>}The participants with their token balances.
   * @throws Will throw an error if the query fails.
   */
  public async getChannelParticipants(channelName: string, limit?: number): Promise<Participant[]> {
    try {
      const response: ChannelParticipantsResponse = await fetchQuery(
        getChannelParticipantsQuery(channelName, limit),
      );

      const participants: Participant[] =
        response.data.FarcasterChannelParticipants.FarcasterChannelParticipant.map(
          (participantData) => {
            const participant = participantData.participant;

            const flattenedTokenBalances = [
              ...participant.userAssociatedAddressDetails.flatMap((detail) =>
                detail.tokenBalances.map((balance) => ({
                  address: balance.token.address,
                  name: balance.token.name,
                  decimals: balance.token.decimals,
                  amount: balance.amount,
                })),
              ),
              ...participant.userAddressDetails.tokenBalances.map((balance) => ({
                address: balance.token.address,
                name: balance.token.name,
                decimals: balance.token.decimals,
                amount: balance.amount,
              })),
            ];

            return {
              addresses: participant.userAddressDetails.addresses,
              socialCapital: participant.socialCapital,
              profileName: participant.profileName,
              tokenBalances: flattenedTokenBalances,
            };
          },
        );

      return participants;
    } catch (error) {
      throw error;
    }
  }
}
