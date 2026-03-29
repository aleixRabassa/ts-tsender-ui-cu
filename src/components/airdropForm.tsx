"use client"

import InputField from "@/components/ui/inputField"
import { useMemo, useState } from "react"
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants"
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi"
import { readContract, waitForTransactionReceipt } from "@wagmi/core"
import { calculateTotal } from "@/utils"

export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")
    const chainId = useChainId()
    const config = useConfig()
    const account = useAccount()
    const total: number = useMemo(() => calculateTotal(amounts), [amounts])
    const { data: hash, isPending, writeContractAsync } = useWriteContract()

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {

        console.log("[getApprovedAmount] Checking approved amount for tSender:", tSenderAddress)

        if (!tSenderAddress) {
            alert("No address found, please use a supported chain")
            return 0
        }

        console.log("[getApprovedAmount] Reading allowance for token:", tokenAddress, "from account:", account.address, "to tSender:", tSenderAddress)

        // read from the chain to see if we have approvetd enough token
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress.trim() as `0x${string}`,
            functionName: "allowance",
            args: [account.address, tSenderAddress.trim() as `0x${string}`]
        })        

        console.log("[getApprovedAmount] Approved amount for tSender:", tSenderAddress, "is", response)

        return response as number
    }

    async function handleSendTokens() {
        
        const tSenderAddress = chainsToTSender[chainId]["tsender"]
        const approvedAmount = await getApprovedAmount(tSenderAddress)
        
        console.log("[handleSendTokens] Total amount to send:", total, "Approved amount:", approvedAmount)

        if (approvedAmount < total) {

            console.log("[handleSendTokens] Not enough approved tokens, sending approval transaction...")

            const approvalHash = await writeContractAsync({
                abi: erc20Abi,
                address: tokenAddress.trim() as `0x${string}`,
                functionName: "approve",
                args: [tSenderAddress.trim() as `0x${string}`, BigInt(total)]
            })

            console.log("[handleSendTokens] Approval transaction sent, hash:", approvalHash)

             const approvalReceipt = await waitForTransactionReceipt(config, {
                hash: approvalHash,
            })

            console.log("[handleSendTokens] Approval transaction confirmed, receipt:", approvalReceipt)
        }
        
        console.log("[handleSendTokens] Sufficient tokens already approved, skipping approval transaction.")

        await writeContractAsync({
            abi: tsenderAbi,
            address: tSenderAddress.trim() as `0x${string}`,
            functionName: "airdropERC20",
            args: [
                tokenAddress.trim() as `0x${string}`,
                recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== '').map(amt => BigInt(amt)),
                BigInt(total)
            ]
        })

        console.log("[handleSendTokens] Airdrop transaction sent, hash:", hash)
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