import { useState, useEffect, useRef } from "react";

const RPC_URLS = [
    "https://rpc.ankr.com/eth",
    "https://cloudflare-eth.com",
    "https://ethereum-rpc.publicnode.com",
];

// ✅ Ethers bypass - direct JSON-RPC fetch, no extra chainId call
async function fetchEthBalance(address) {
    for (const rpc of RPC_URLS) {
        try {
            const res = await fetch(rpc, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "eth_getBalance",
                    params: [address, "latest"],
                    id: 1,
                }),
            });

            const data = await res.json();
            if (data?.result) {
                // hex wei → ETH
                const wei = BigInt(data.result);
                const eth = Number(wei) / 1e18;
                return { balance: eth.toFixed(6), rpc, error: null };
            }
        } catch (err) {
            console.warn(`${rpc} failed:`, err.message);
        }
    }
    return { balance: null, rpc: null, error: "All RPCs failed" };
}

// ✅ Reusable Hook
function useEthBalance(address) {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rpc, setRpc] = useState("");
    const abortRef = useRef(false);

    useEffect(() => {
        const trimmed = address?.trim();

        if (!trimmed) {
            setBalance(null);
            setError("");
            setLoading(false);
            return;
        }

        // Basic address validation without ethers
        if (!/^0x[0-9a-fA-F]{40}$/.test(trimmed)) {
            setError("Invalid Ethereum address");
            setBalance(null);
            return;
        }

        abortRef.current = false;
        setError("");

        const timer = setTimeout(async () => {
            if (abortRef.current) return;
            setLoading(true);

            const result = await fetchEthBalance(trimmed);

            if (abortRef.current) return;

            if (result.error) {
                setError(result.error);
                setBalance(null);
            } else {
                setBalance(result.balance);
                setRpc(result.rpc);
                setError("");
            }
            setLoading(false);
        }, 800);

        return () => {
            clearTimeout(timer);
            abortRef.current = true;
        };
    }, [address]);

    return { balance, loading, error, rpc };
}

// ✅ Reusable Component - sirf address pass karo
export function WalletBalance({ address }) {
    const { balance, loading, error, rpc } = useEthBalance(address);

    if (!address?.trim()) return null;
    if (loading) return <p>Fetching...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!balance) return null;

    return (
        <div>
            {/* <p className="text-(--primary-color)"><strong className="text-white">Address:</strong> {address}</p>
            <p><strong>ETH Balance:</strong> {balance} ETH</p>
            <p style={{ color: "gray", fontSize: "12px" }}>via {rpc}</p> */}
        </div>
    );
}