import { Channel } from "./channels";



/**
 * Interface for the parameters required for fetching participant token balances.
 */
export interface ParticipantTokenBalancesParams {
  /**
   * The name of the channel to search for participants.
   */
  channelName: string;
  /**
   * The address of the token to filter balances.
   */
  tokenAddress: `0x${string}`;
}


/**
 * Interface for the token details.
 */
export interface Token {
  address: string;
  decimals: number;
  name: string;
  totalSupply: string;
  blockchain: string;
}

/**
 * Interface for the token balance details.
 */
export interface TokenBalance {
  amount: string;
  token: {
    address: string;
    name: string;
    decimals: string;
    blockchain: string
    totalSupply: string;
  };
}

/**
 * Interface for the user address details containing token balances.
 */
export interface UserAddressDetails {
  tokenBalances: TokenBalance[];
}

export interface SocialCapital {
  socialCapitalScore: number;
  socialCapitalRank: number;
}


/**
 * Interface for the participant details.
 */
export interface Participant {
  userAddress: string;
  profileName: string;
  userAddressDetails: UserAddressDetails;
  socialCapital: SocialCapital;
}


export interface ChannelWithParticipants extends Pick<Channel, "channelId"> {
  participants: {
    participant: Participant;
  }[];
}


/**
 * Interface for the Farcaster channels query response.
 */
export interface ChannelPaticipantsBalanceResponse {
  data: {
    FarcasterChannels: {
      FarcasterChannel: ChannelWithParticipants[];
    };
  };
}



export const getChannelParticipantsBalanceQuery = (channelName: string, tokenAddress: string) => `
  query GetChannelParticipants {
    FarcasterChannels(input: {blockchain: ALL, filter: {name: {_regex: "${channelName}"}}}) {
      FarcasterChannel {
        channelId
        dappName
        participants {
          participant {
            userAddress
            userAddressDetails {
              tokenBalances(
                input: {blockchain: base, filter: {tokenAddress: {_eq: "${tokenAddress}"}}}
              ) {
                token {
                  address
                  decimals
                  name
                  totalSupply
                  blockchain
                }
                amount
              }
            }
          }
        }
      }
    }
  }
`;



