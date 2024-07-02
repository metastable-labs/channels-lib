
export interface ChannelCastsResponse {

  data: {
    FarcasterCasts: {
      Cast: {
        castedAtTimestamp: string;
        url: string;
        text: string;
        numberOfReplies: number;
        numberOfRecasts: number;
        numberOfLikes: number;
        fid: string;
        castedBy: {
          profileName: string;
          userAddress: string;
          profileImage: string;
        };
      }[];
    };
  };
}



export const getChannelCastsQuery = (channelName: string, limit: number = 50, startDate?: Date, endDate?: Date) => {

  let end = endDate ? endDate.toISOString() : new Date().toISOString()

  let dateFilter = startDate ? `, castedAtTimestamp: {_gte: "${startDate.toISOString()}", _lte: "${end}"}` : '';

  return `
  query GetCastsInChannel {
    FarcasterCasts(
      input: {blockchain: ALL, filter: {rootParentUrl: {_eq: "https://warpcast.com/~/channel/${channelName}"}${dateFilter}}, limit: ${limit}}
    ) {
      Cast {
        castedAtTimestamp
        url
        text
        numberOfReplies
        numberOfRecasts
        numberOfLikes
        fid
        castedBy {
          profileName
          userAddress
          profileImage
        }
      }
    }
  }
  `;
};



export interface ChannelsByUserResponse {
  data: {
    FarcasterChannels: {
      FarcasterChannel: {
        createdAtTimestamp: string;
        channelId: string;
        name: string;
        description: string;
        imageUrl: string;
        leadIds: string[];
        url: string;
        dappName: string
      }[];
    };
  };
}


export const getChannelsByUserQuery = (name: string, limit: number = 50) => `
query GetFarcasterChannelsCreatedByUser {
  FarcasterChannels(
    input: {blockchain: ALL, filter: {leadIdentity: {_eq: "fc_fname:${name}"}}, limit: ${limit}}
  ) {
    FarcasterChannel {
      createdAtTimestamp
      channelId
      name
      description
      imageUrl
      leadIds
      dappName
      url
      followerCount
    }
  }
}`



export interface ChannelParticipantsResponse {
  data: {
    FarcasterChannelParticipants: {
      FarcasterChannelParticipant: {
        participant: {
          socialCapital: {
            socialCapitalScore: number;
            socialCapitalRank: number
          }
          profileName: string;
          userAssociatedAddressDetails: {
            tokenBalances: {
              token: {
                address: string;
                name: string;
                decimals: number;
              };
              amount: string;
            }[];
            addresses: string[];
          }[];
          userAddressDetails: {
            tokenBalances: {
              token: {
                address: string;
                name: string;
                decimals: number;
              };
              amount: string;
            }[];
          };
        };
      }[];
    };
  };
}


export const getChannelParticipantsQuery = (channelName: string, limit: number = 10) => `
query ChannelParticipants {
  FarcasterChannelParticipants(
    input: {filter: {channelName: {_eq: "${channelName}"}}, blockchain: ALL, limit: ${limit}}
  ) {
    FarcasterChannelParticipant {
      participant {
        profileName
        userAssociatedAddressDetails {
          tokenBalances {
            token {
              address
              name
              decimals
            }
            amount
          }
          addresses
        }
        userAddressDetails {
          tokenBalances {
            amount
            token {
              decimals
              name
              address
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
}
`


