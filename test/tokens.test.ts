import { config } from 'dotenv';
import Launchbox from "../src";

config();

describe('Launchbox SDK Test', () => {
    let launchbox = new Launchbox(process.env.TEST_AIRSTACK_KEYS!, "dev");

    it('should get channel participants, their social capital and their token balance', async () => {
        let channel = "gmism"
        let chain = "base"

        /**
         * https://basescan.org/token/0x4ed4e862860bed51a9570b96d89af5e1b0efefed
         */

        let channelToken = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed" as `0x${string}`
        const response = await launchbox.getChannelSocialCapital(channel, chain, channelToken, 5)
        expect(response).toBeDefined();
    })

    it('should get token balances of channel participants', async () => {
        let channelName = "gmism"
        /**
         * https://basescan.org/token/0x4ed4e862860bed51a9570b96d89af5e1b0efefed
         */

        let tokenAddress = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed" as `0x${string}`
        const response = await launchbox.getParticipantTokenBalances({ channelName, tokenAddress })
        expect(response).toBeDefined();
    })

});
