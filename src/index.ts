import { fetchQuery, init } from '@airstack/node';
import { Cast, ChannelPaticipantsBalanceResponse, ChannelsByUserResponse, FarcasterCastsResponse, FarcasterChannelParticipantsResponse, getChannelCastsQuery, getChannelParticipantsBalanceQuery, getChannelsByUserQuery, getSocialScoresOfAllChannelFollowersQuery, getUserInfoQuery, Participant, ParticipantTokenBalancesParams, UserInfoResponse } from "./query";

export default class Launchbox {
  constructor(key: string, env: 'dev' | 'prod' = 'prod') {
    init(key, env);
  }


  /**
 * Fetches channels associated with a user's address.
 * @param {`0x${string}`} owner - The Ethereum address of the user in hexadecimal format.
 * @returns {Promise<ChannelsByUserResponse['data']>} A promise that resolves to the data containing the channels associated with the user.
 * @throws Will throw an error if the query fails.
 */
  public async getChannelsByUserAddress(owner: `0x${string}`): Promise<ChannelsByUserResponse['data']> {
    try {
      const { data: { Socials: { Social: socials } } }: UserInfoResponse = await fetchQuery(getUserInfoQuery(owner))
      const { data }: ChannelsByUserResponse = await fetchQuery(getChannelsByUserQuery(socials[0].profileName))
      return data
    } catch (error) {
      throw new Error('Failed to channels created by user');
    }
  }


  /**
   * Fetches casts from a specified channel.
   * @param {string} channelUrl - The URL of the channel to fetch casts from.
   * @returns {Promise<Cast[]>} An array of casts from the channel.
   * @throws Will throw an error if the query fails.
   */
  public async getCasts(channelUrl: string): Promise<Cast[]> {
    try {
      const query = getChannelCastsQuery(channelUrl, 50);
      const response: FarcasterCastsResponse = await fetchQuery(query);

      // Ensure the response structure is as expected
      if (!response?.data?.FarcasterCasts?.Cast) {
        throw new Error('Unexpected response structure');
      }

      return response.data.FarcasterCasts.Cast;
    } catch (error) {
      console.error('Failed to fetch casts:', error);
      throw new Error('Failed to fetch casts from the channel');
    }
  }


  /**
   * Fetches the number of casts in a channel made within the last week.
   * @param {string} channelUrl - The URL of the channel to fetch casts from.
   * @returns {Promise<number>} The number of casts made in the last week.
   * @throws Will throw an error if the query fails.
   */
  public async getNumberOfWeeklyCasts(channelUrl: string): Promise<number> {
    try {
      const oneWeekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
      const query = getChannelCastsQuery(channelUrl, 50);
      const response: FarcasterCastsResponse = await fetchQuery(query);

      // Ensure the response structure is as expected
      if (!response?.data?.FarcasterCasts?.Cast) {
        throw new Error('Unexpected response structure');
      }

      const weeklyCasts = response.data.FarcasterCasts.Cast.filter(
        (cast) => new Date(cast.castedAtTimestamp) >= oneWeekAgo
      );

      return weeklyCasts.length;
    } catch (error) {
      console.error('Failed to fetch weekly casts:', error);
      throw new Error('Failed to fetch weekly casts from the channel');
    }
  }



  /**
 * Fetches the token balances for participants in a given channel.
 * @param {ParticipantTokenBalancesParams} params - The parameters for the query.
 * @returns {Promise<Participant[]>} The participants with their token balances.
 * @throws Will throw an error if the query fails.
 */
  getParticipantTokenBalances = async ({
    channelName,
    tokenAddress
  }: ParticipantTokenBalancesParams): Promise<Participant[]> => {
    try {

      const response: ChannelPaticipantsBalanceResponse = await fetchQuery(getChannelParticipantsBalanceQuery(channelName, tokenAddress));

      const participants = response.data.FarcasterChannels.FarcasterChannel.flatMap(
        (channel) => channel.participants.map((p) => p.participant)
      );

      return participants;
    } catch (error) {
      console.error('Error fetching participant token balances:', error);
      throw error;
    }
  };



  /**
   * getChannelSocialCapital
   */
  public async getChannelSocialCapital(channelName: string, token?: `0x${string}`) {
    try {
      const query = getSocialScoresOfAllChannelFollowersQuery(channelName, token, "base")
      const { data }: FarcasterChannelParticipantsResponse = await fetchQuery(query)
      return data
    } catch (error) {
      throw error
    }
  }
}



