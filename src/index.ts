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
      throw new Error('Failed to fetch weekly casts from the channel');
    }
  }



  /**
 * Fetches the token balances for participants in a given channel.
 * @param {ParticipantTokenBalancesParams} params - The parameters for the query.
 * @returns {Promise<Participant[]>} The participants with their token balances.
 * @throws Will throw an error if the query fails.
 */
  public async getParticipantTokenBalances({
    channelName,
    tokenAddress
  }: ParticipantTokenBalancesParams): Promise<Participant[]> {
    try {

      const response: ChannelPaticipantsBalanceResponse = await fetchQuery(getChannelParticipantsBalanceQuery(channelName, tokenAddress));

      const participants = response.data.FarcasterChannels.FarcasterChannel.flatMap(
        (channel) => channel.participants.map((p) => p.participant)
      );

      return participants;
    } catch (error) {
      throw error;
    }
  };



  /**
   * getChannelSocialCapital
   */
  public async getChannelSocialCapital(channelName: string, chain: string = "base", token: `0x${string}`, limit: number = 50) {
    try {
      const query = getSocialScoresOfAllChannelFollowersQuery(channelName, token, chain, limit)
      const { data }: FarcasterChannelParticipantsResponse = await fetchQuery(query)

      const PARTICIPANTS = data.FarcasterChannelParticipants.FarcasterChannelParticipant;

      const FARCASTS = data.FarcasterCasts.Cast

      const socialScores = PARTICIPANTS.map(({ participant }, idx) => {
        return participant.socialCapital.socialCapitalScore
      })
      const averageScore = socialScores.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / socialScores.length;

      const engagements = FARCASTS.map((f, idx) => {
        return f.numberOfLikes
      })
      const averageEngagement = engagements.reduce((acc, curr) => acc + curr, 0) / engagements.length

      const tokenHolders = PARTICIPANTS.filter(({ participant }) => {
        return participant.userAssociatedAddressDetails.some(detail =>
          detail.tokenBalances.some(tokenBalance =>
            parseFloat(tokenBalance.formattedAmount) > 0 && tokenBalance.token.address.toLowerCase() === token.toLowerCase()
          )
        );
      });
      const score = (tokenHolders.length + (averageEngagement * 1000.0) + (averageScore * 1000.0)) / 500.0
      return score
    } catch (error) {
      throw error
    }
  }
}



