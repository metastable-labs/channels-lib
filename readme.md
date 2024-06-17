# Launchbox SDK Documentation

## Introduction

The Launchbox SDK provides a set of functions to interact with Farcaster channels, fetch user information, casts, and social capital metrics. This document describes how to use the various functions available in the SDK.

## Installation

To install the Launchbox SDK, you need to include it in your project. Use npm or yarn to install the package:

```sh
npm install channels-lib
```

or using Yarn

```sh
yarn install channels-lib
```

## Initialization

To use the SDK, you need to initialize it with your API key and environment.

```ts
import Launchbox from 'launchbox';

const launchbox = new Launchbox('your-api-key', 'prod'); // Use 'dev' for the development environment
```

### Functions

1. `getChannelsByUserAddress` - Fetches channels associated with a user's address.

```ts
/**
 * Fetches channels associated with a user's address.
 * @param {`0x${string}`} owner - The Ethereum address of the user in hexadecimal format.
 * @returns {Promise<ChannelsByUserResponse['data']>} A promise that resolves to the data containing the channels associated with the user.
 * @throws Will throw an error if the query fails.
 */

public async getChannelsByUserAddress(owner: `0x${string}`): Promise<ChannelsByUserResponse['data']>
```

2. `getCasts` -Fetches casts from a specified channel.

```ts
/**
 * Fetches casts from a specified channel.
 * @param {string} channelUrl - The URL of the channel to fetch casts from.
 * @returns {Promise<Cast[]>} An array of casts from the channel.
 * @throws Will throw an error if the query fails.
 */
public async getCasts(channelUrl: string): Promise<Cast[]>
```

3. `getNumberOfWeeklyCasts` - Fetches the number of casts in a channel made within the last week.

```ts
/**
 * Fetches the number of casts in a channel made within the last week.
 * @param {string} channelUrl - The URL of the channel to fetch casts from.
 * @returns {Promise<number>} The number of casts made in the last week.
 * @throws Will throw an error if the query fails.
 */
public async getNumberOfWeeklyCasts(channelUrl: string): Promise<number>
```

4. `getParticipantTokenBalances` - Fetches the token balances for participants in a given channel.

```ts
/**
 * Fetches the token balances for participants in a given channel.
 * @param {ParticipantTokenBalancesParams} params - The parameters for the query.
 * @returns {Promise<Participant[]>} The participants with their token balances.
 * @throws Will throw an error if the query fails.
 */
public async getParticipantTokenBalances(params: ParticipantTokenBalancesParams): Promise<Participant[]>
```

5. `getChannelSocialCapital` - Fetches the social capital of a channel.

```ts
/**
 * Fetches the social capital of a channel.
 * @param {string} channelName - The name of the channel.
 * @param {string} [chain='base'] - The blockchain to query (default is 'base').
 * @param {`0x${string}`} token - The token address in hexadecimal format.
 * @param {number} [limit=50] - The maximum number of participants to fetch.
 * @returns {Promise<number>} The social capital score of the channel.
 * @throws Will throw an error if the query fails.
 */
public async getChannelSocialCapital(channelName: string, chain: string = "base", token: `0x${string}`, limit: number = 50): Promise<number>
```
