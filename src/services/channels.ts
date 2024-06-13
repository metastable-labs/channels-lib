import { fetchQuery } from '@airstack/node';
import { gql } from '@apollo/client';

const getChannelsCreatedByAnAddress = async (userAddress: `0x${string}`) => {
  // get user details by address
  const userQuery = `query GetFarcasterUserDetailsByAddress {
  Socials(
    input: {filter: {userAssociatedAddresses: {_eq: "${userAddress}"}, dappName: {_eq: farcaster}}, blockchain: ethereum}
  ) {
    Social {
      dappName
      profileName
      userAddress
      userCreatedAtBlockTimestamp
      userCreatedAtBlockNumber
      userRecoveryAddress
      connectedAddresses {
        address
        blockchain
      }
    }
  }
}`;

  const userData = await fetchQuery(userQuery);

  // get channel data
  const profileName = userData.data?.Socials?.Social[0].profileName;
  const channelQuery = `query GetFarcasterChannelsCreatedByUser {
  FarcasterChannels(
    input: {blockchain: ALL, filter: {leadIdentity: {_eq: "fc_fname:${profileName}"}}, limit: 50}
  ) {
    FarcasterChannel {
      createdAtTimestamp
      channelId
      name
      description
      imageUrl
      leadIds
      url
      followerCount
    }
  }
}`;

  const channelData = await fetchQuery(channelQuery);

  return channelData;
};

const getCastsByChannel = async (channelUrl: string) => {
  const castQuery = `query GetCastsInChannel {
  FarcasterCasts(input: {blockchain: ALL, filter: {rootParentUrl: {_eq: "${channelUrl}"}}, limit: 50}) {
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
      }
      channel {
        name
      }
    }
  }
}`;

  const castData = await fetchQuery(castQuery);
  return castData;
};

export { getChannelsCreatedByAnAddress, getCastsByChannel };
