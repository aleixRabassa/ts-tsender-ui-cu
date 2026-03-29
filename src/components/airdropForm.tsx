"use client"

import InputField from "@/components/ui/inputField"
import TransactionDetails from "@/components/ui/transactionDetails"
import { useMemo, useState } from "react"
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants"
import { useChainId, useConfig, useAccount, useWriteContract, useReadContracts } from "wagmi"
import { readContract, waitForTransactionReceipt } from "@wagmi/core"
import { calculateTotal } from "@/utils"

export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const chainId = useChainId()
    const config = useConfig()
    const account = useAccount()
    const total: number = useMemo(() => calculateTotal(amounts), [amounts])
    const { data: hash, isPending, writeContractAsync } = useWriteContract()

    const isValidAddress = /^0x[0-9a-fA-F]{40}$/.test(tokenAddress.trim())

    const { data: tokenData } = useReadContracts({
        contracts: [
            {
                abi: erc20Abi,
                address: tokenAddress.trim() as `0x${string}`,
                functionName: "name",
            },
            {
                abi: erc20Abi,
                address: tokenAddress.trim() as `0x${string}`,
                functionName: "decimals",
            },
        ],
        query: { enabled: isValidAddress },
    })

    const tokenName = tokenData?.[0]?.result
    const tokenDecimals = tokenData?.[1]?.result

    const amountInTokens = useMemo(() => {
        if (!total || !tokenDecimals) return null
        return (total / Math.pow(10, Number(tokenDecimals))).toString()
    }, [total, tokenDecimals])

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
        setIsLoading(true)
        try {
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
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 p-6">
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
            <TransactionDetails
                tokenName={tokenName ? String(tokenName) : undefined}
                total={total}
                amountInTokens={amountInTokens}
            />
            <div className="flex justify-center mt-2">
                <button onClick={handleSendTokens} disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
                    {isLoading && (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    )}
                    {isLoading ? "Processing..." : "Send Tokens"}
                </button>
            </div>
        </div>
    );
}