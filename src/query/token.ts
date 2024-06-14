import { fetchQuery } from "@airstack/node";



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
    token: Token;
    amount: string;
}

/**
 * Interface for the user address details containing token balances.
 */
export interface UserAddressDetails {
    tokenBalances: TokenBalance[];
}

/**
 * Interface for the participant details.
 */
export interface Participant {
    userAddress: string;
    userAddressDetails: UserAddressDetails;
}

/**
 * Interface for the Farcaster channel.
 */
export interface FarcasterChannel {
    channelId: string;
    dappName: string;
    participants: {
        participant: Participant;
    }[];
}


/**
 * Interface for the Farcaster channels query response.
 */
export interface FarcasterChannelsResponse {
    data: {
        FarcasterChannels: {
            FarcasterChannel: FarcasterChannel[];
        };
    };
}


/**
 * Fetches the token balances for participants in a given channel.
 * @param {ParticipantTokenBalancesParams} params - The parameters for the query.
 * @returns {Promise<Participant[]>} The participants with their token balances.
 * @throws Will throw an error if the query fails.
 */
export const getParticipantTokenBalances = async ({
    channelName,
    tokenAddress
}: ParticipantTokenBalancesParams): Promise<Participant[]> => {
    try {
        const query = `
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

        const response: FarcasterChannelsResponse = await fetchQuery(query);

        const participants = response.data.FarcasterChannels.FarcasterChannel.flatMap(
            (channel) => channel.participants.map((p) => p.participant)
        );

        return participants;
    } catch (error) {
        console.error('Error fetching participant token balances:', error);
        throw error;
    }
};