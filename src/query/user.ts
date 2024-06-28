export interface UserInfoResponse {
  data: {
    Socials: {
      Social: {
        dappName: string;
        profileName: string;
        userAddress: string;
        userCreatedAtBlockTimestamp: string;
        userCreatedAtBlockNumber: number;
        userRecoveryAddress: string;
        connectedAddresses: {
          address: string;
          blockchain: string;
        }[];
      }[];
    };
  };
}



export const getUserInfoQuery = (address: `0x${string}`) => `
query GetUserInfoQuery {
    Socials(
      input: {filter: {userAssociatedAddresses: {_eq: "${address}"}, dappName: {_eq: farcaster}}, blockchain: ethereum}
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
}`

