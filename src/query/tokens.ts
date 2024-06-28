
export interface ChannelPaticipantsTokenBalanceResponse {
  data: {
    FarcasterChannels: {
      FarcasterChannel: {
        channelId: string;
        dappName: string;
        participants: {
          participant: {
            userAssociatedAddressDetails: {
              addresses: string[];
              tokenBalances: {
                amount: string;
                token: {
                  address: string;
                  name: string;
                  decimals: string;
                };
              }[];
            }[];
            userAddressDetails: {
              addresses: string[];
              tokenBalances: {
                amount: string;
                token: {
                  address: string;
                  name: string;
                  decimals: string;
                };
              }[];
            };
            profileName: string;
          };
        }[];
      }[];
    };
  };
}



export const getChannelParticipantsTokenBalanceQuery = (channelName: string, tokenAddress: string, limit: number) => `
  query GetChannelParticipantsTokenBalance {
  FarcasterChannels(input: {blockchain: ALL, filter: {name: {_regex: "${channelName}"}}}) {
    FarcasterChannel {
      channelId
      dappName
      participants(input: {limit: ${limit}}) {
        participant {
          userAssociatedAddressDetails {
            addresses
            tokenBalances(
              input: {filter: {tokenAddress: {_eq: "${tokenAddress}"}}}
            ) {
              amount
              token {
                address
                name
                decimals
              }
            }
          }
          userAddressDetails {
            addresses
            tokenBalances(
              input: {filter: {tokenAddress: {_eq: "${tokenAddress}"}}}
            ) {
              amount
              token {
                address
                name
                decimals
              }
            }
          }
        }
      }
    }
  }
}
`;



