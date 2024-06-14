/**
 * Interface representing the channel details.
 */
export interface Channel {
  createdAtTimestamp: string;
  channelId: string;
  name: string;
  description: string;
  imageUrl: string;
  leadIds: string[];
  url: string;
  dappName: string
}


/**
 * Interface representing the profile of the user who casted the post.
 */
export interface CastedBy {
  /**
   * The profile name of the user.
   */
  profileName: string;
}

/**
 * Interface representing a single cast in the Farcaster Cast.
 */
export interface Cast {
  /**
   * The timestamp when the cast was made.
   */
  castedAtTimestamp: string;
  /**
   * The URL of the cast.
   */
  url: string;
  /**
   * The text content of the cast.
   */
  text: string;
  /**
   * The number of replies to the cast.
   */
  numberOfReplies: number;
  /**
   * The number of recasts (shares) of the cast.
   */
  numberOfRecasts: number;
  /**
   * The number of likes the cast received.
   */
  numberOfLikes: number;
  /**
   * The unique identifier (FID) of the cast.
   */
  fid: string;
  /**
   * The profile of the user who casted the post.
   */
  castedBy: CastedBy;
  /**
   * The channel details where the cast was made.
   */
  channel: Channel;
}

/**
 * Interface representing the Farcaster casts query response.
 */
export interface FarcasterCastsResponse {
  /**
   * The data object containing the FarcasterCasts result.
   */
  data: {
    /**
     * The FarcasterCasts object containing the list of casts.
     */
    FarcasterCasts: {
      /**
       * The list of casts in the channel.
       */
      Cast: Cast[];
    };
  };
}






export const getChannelCastsQuery = (channelUrl: string, limit: number) => `
query GetCastsInChannel {
  FarcasterCasts(input: {blockchain: ALL, filter: {rootParentUrl: {_eq: ${channelUrl}}}, limit: ${limit}}) {
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
      }
      channel {
        name
        createdAtTimestamp
        channelId
        name
        description
        imageUrl
        leadIds
        url
        dappName
        followerCount
      }
    }
  }
}
`;




export interface ChannelsByUserResponse {
  data: {
    FarcasterChannels: {
      FarcasterChannel: Channel[];
    };
  };
}


export const getChannelsByUserQuery = (name: string) => `
GetFarcasterChannelsCreatedByUser {
  FarcasterChannels(
    input: {blockchain: ALL, filter: {leadIdentity: {_eq: "fc_fname:${name}"}}, limit: 50}
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