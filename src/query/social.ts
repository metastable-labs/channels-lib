import { Cast } from "./channels";
import { Participant } from "./tokens";


export interface FarcasterChannelParticipant {
  participant: Participant;
}


export interface FarcasterChannelParticipantsResponse {
  data: {
    FarcasterChannelParticipants: {
      FarcasterChannelParticipant: FarcasterChannelParticipant[];
    };
    FarcasterCasts: {
      Cast: Omit<Cast, "channel">[];
    };
  };
}


export const getSocialScoresOfAllChannelFollowersQuery = (channelName: string, token: `0x${string}`, chain: string) => `
query GetSocialScoresOfAllChannelFollowers {
    FarcasterChannelParticipants(
      input: {filter: {channelActions: {_eq: follow}, channelId: {_eq: ${channelName}}}, blockchain: ALL, limit: 50}
    ) {
      FarcasterChannelParticipant {
        participant {
          profileName
          userAddress
          userAddressDetails {
            tokenBalances(
              input: {blockchain: ${chain}, filter: {tokenAddress: {_eq: ${token}}}}
            ) {
              amount
              token {
                address
                name
              }
            }
          }
          socialCapital {
            socialCapitalScore
            socialCapitalRank
          }
        }
      }
    }
    FarcasterCasts(
      input: {filter: {rootParentUrl: {_eq: $"https://warpcast.com/~/channel/${channelName}"}}, blockchain: ALL}
    ) {
      Cast {
        castedBy {
          profileName
          userAddress
        }
        numberOfLikes
        numberOfRecasts
        text
        url
        numberOfReplies
        createdAtTimestamp
      }
    }
  }
`