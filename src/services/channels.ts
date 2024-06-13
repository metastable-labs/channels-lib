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

  console.log(channelData.data.FarcasterChannels.FarcasterChannel);

  return channelData;
};

export { getChannelsCreatedByAnAddress };
