
export const getUserInfoQuery = (address: `0x${string}`) => `query GetUserInforQuery {
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

export interface UserInfoResponse {
    data: {
        Socials: {
            Social: Social[];
        };
    };
}

export interface Social {
    dappName: string;
    profileName: string;
    userAddress: string;
    userCreatedAtBlockTimestamp: string;
    userCreatedAtBlockNumber: number;
    userRecoveryAddress: string;
    connectedAddresses: ConnectedAddress[];
}

export interface ConnectedAddress {
    address: string;
    blockchain: string;
}


