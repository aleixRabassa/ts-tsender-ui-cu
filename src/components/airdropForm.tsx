"use client"

import InputField from "@/components/ui/inputField"
import { useState } from "react"
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants"
import { useChainId, useConfig, useAccount } from "wagmi"
import { readContract } from "@wagmi/core"

export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")
    const chainId = useChainId()
    const config = useConfig()
    const account = useAccount()

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress) {
            alert("No address found, please use a supported chain")
            return 0
        }

        // read from the chain to see if we have approvetd enough token
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address, tSenderAddress as `0x${string}`]
        })

        return response as number
    }

    async function handleSendTokens() {
        const tSenderAddress = chainsToTSender[chainId]["tsender"]
        const approvedAmount = await getApprovedAmount(tSenderAddress)
        
        console.log("tSenderAddress:", tSenderAddress)
        console.log("chainId:", chainId)
        console.log("approvedAmount:", approvedAmount)
    }

    return (
        <div>
            <InputField 
                label="Token Address" 
                placeholder="0x..." 
                value={tokenAddress}
                onChange={e => setTokenAddress(e.target.value)} 
            />
            <InputField 
                label="Recipients" 
                placeholder="0x..., 0x..., 0x..." 
                value={recipients}
                onChange={e => setRecipients(e.target.value)} 
                multiline
            />
            <InputField 
                label="Amounts" 
                placeholder="100, 200,300" 
                value={amounts}
                onChange={e => setAmounts(e.target.value)} 
                multiline
            />
            <button onClick={handleSendTokens} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Send Tokens
            </button>
        </div>
    );
}
