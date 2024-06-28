export type Participant = {
    profileName: string;
    tokenBalances: {
        address: string;
        name: string;
        decimals: number;
        amount: string;
    }[];
    socialCapital?: {
        socialCapitalScore: number;
        socialCapitalRank: number
    }
}


export type Channel = {
    createdAtTimestamp: string;
    channelId: string;
    name: string;
    description: string;
    imageUrl: string;
    leadIds: string[];
    url: string;
    dappName: string
    casts?: Cast[]
}


export type Cast = {
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
    };
}