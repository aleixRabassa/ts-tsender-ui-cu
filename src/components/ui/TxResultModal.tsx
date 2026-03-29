interface TxResultModalProps {
    success: boolean
    error?: string
    onClose: () => void
}

export default function TxResultModal({ success, error, onClose }: TxResultModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 flex flex-col gap-4">
                <div className={`flex items-center gap-3 text-lg font-semibold ${
                    success ? "text-green-600" : "text-red-600"
                }`}>
                    {success ? (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                    {success ? "Airdrop Successful" : "Airdrop Failed"}
                </div>
                {error && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 break-words">{error}</p>
                )}
                <button
                    onClick={onClose}
                    className="self-end px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                    Close
                </button>
            </div>
        </div>
    )
}
