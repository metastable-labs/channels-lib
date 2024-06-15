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


export const getSocialScoresOfAllChannelFollowersQuery = (channelName: string, token: `0x${string}`, chain: string, limit: number) => `
query GetSocialScoresOfAllChannelFollowers {
  FarcasterChannelParticipants(
    input: {filter: {channelActions: {_eq: follow}, channelId: {_eq: "${channelName}"}}, limit: ${limit}, blockchain: ALL}
  ) {
    FarcasterChannelParticipant {
      participant {
        profileName
        userAddress
        userAssociatedAddressDetails {
          tokenBalances(
            input: {filter: {tokenAddress: {_eq: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"}}, blockchain: ${chain}}
          ) {
            formattedAmount
            token {
              address
              name
            }
          }
          addresses
        }
        userAddressDetails {
          tokenBalances(
            input: {filter: {tokenAddress: {_eq: "0x4ed4e862860bed51a9570b96d89af5e1b0efefed"}}, blockchain: ${chain}}
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
    input: {filter: {rootParentUrl: {_eq: "https://warpcast.com/~/channel/${channelName}"}}, blockchain: ALL}
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
    }
  }
}
`