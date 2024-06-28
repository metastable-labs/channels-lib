# Launchbox SDK Documentation

## Introduction

The Launchbox SDK provides a set of functions to interact with Farcaster channels, fetch user information, casts, and social capital metrics. This document describes how to use the various functions available in the SDK.

## Installation

To install the Launchbox SDK, you need to include it in your project. Use npm or yarn to install the package:

```sh
npm add channels-lib
```

or using Yarn

```sh
yarn add channels-lib
```

## Usage

Import the SDK and initialize with your API key:

```javascript

import Launchbox from 'launchbox-sdk';

const launchbox = new Launchbox('your-api-key');

// Example: Fetch channels by user address
const ownerAddress = '0x459D7FB72ac3dFB0666227B30F25A424A5583E9c';
launchbox.getChannelsByUserAddress(ownerAddress)
  .then(channels => {
    console.log('Channels:', channels);
  })
  .catch(error => {
    console.error('Error fetching channels:', error.message);
  });

// Example: Calculate social capital score for a channel
const channelName = 'example_channel';
const tokenAddress = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85';
launchbox.getChannelSocialCapital(channelName, tokenAddress)
  .then(score => {
    console.log('Social capital score:', score);
  })
  .catch(error => {
    console.error('Error calculating social capital:', error.message);
  });
```

## API Reference

- `getChannelsByUserAddress(owner: string, limit?: number): Promise<Channel[]>`
Fetches channels associated with a user's Ethereum address.

- `getChannelCasts(channelName: string, limit?: number, date?: Date): Promise<Cast[]>`
Fetches casts from a specified channel optionally filtered by limit and date.

- `getChannelSocialCapital(channelName: string, token: string): Promise<number>`
Calculates the social capital score of a given channel based on participant metrics and engagement.

- `getChannelParticipants(channelName: string, limit?: number): Promise<Participant[]>`
Fetches participants and their token balances in a specified channel.

## Available Types

```typescript
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
```
