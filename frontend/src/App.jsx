import { useState } from "react";
import { useWallet } from "./hooks/useWallet.js";
import { getCredit } from "./api.js";

export default function App() {
  const { address, connect, disconnect } = useWallet();
  const [creditId, setCreditId] = useState("");
  const [credit, setCredit] = useState(null);
  const [error, setError] = useState(null);

  async function lookup() {
    setError(null);
    setCredit(null);
    try {
      setCredit(await getCredit(creditId));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 600, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>💧 Stellar Aqua-Ledger</h1>

      {address ? (
        <p>
          Connected: <code>{address.slice(0, 8)}…{address.slice(-4)}</code>{" "}
          <button onClick={disconnect}>Disconnect</button>
        </p>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}

      <hr />

      <h2>Look up a Water Credit</h2>
      <input
        type="number"
        placeholder="Credit ID"
        value={creditId}
        onChange={e => setCreditId(e.target.value)}
      />
      <button onClick={lookup} disabled={!creditId}>Fetch</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {credit && (
        <pre style={{ background: "#f4f4f4", padding: "1rem" }}>
          {JSON.stringify(credit, null, 2)}
        </pre>
      )}
    </main>
  );
}
