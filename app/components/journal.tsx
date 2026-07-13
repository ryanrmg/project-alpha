import { useState } from "react";
import { useQuery } from '@tanstack/react-query';

// 1. Define the fetcher function pointing to your Go backend
const fetchUserTrades = async (accountId) => {
  const response = await fetch(`http://localhost:8080/api/user/trades?accountId=${accountId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // Returns the array of GatewayUserTrade items
};

const fetchUserAccounts = async () => {
  const response = await fetch(`http://localhost:8080/api/user/accounts`);
  console.log(response)
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};


export default function Journal({ accountId }) {

  const [selectedAccountId, setSelectedAccountId] = useState("");

  const {
    data: accounts,
    isLoading: accountsLoading,
    error: accountsError,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchUserAccounts,
  });

  const {
    data: trades,
    isLoading: tradesLoading,
    error: tradesError,
  } = useQuery({
    queryKey: ["trades", selectedAccountId],
    queryFn: () => fetchUserTrades(selectedAccountId),
    enabled: !!selectedAccountId,
  });

  if (accountsLoading) return <div>Loading accounts...</div>;
  if (accountsError)
    return <div>Error: {accountsError.message}</div>;

  return (
    <div className="trade-container">
      <h2>Journal & Trade Logs</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Account:&nbsp;
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
          >
            <option value="">Select an account</option>

            {accounts?.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name ?? account.id}
              </option>
            ))}
          </select>
        </label>
      </div>

      {tradesLoading && <div>Loading trades...</div>}

      {tradesError && (
        <div>Error loading trades: {tradesError.message}</div>
      )}

      {trades && (
        <table>
          <thead>
            <tr>
              <th>Trade ID</th>
              <th>Contract</th>
              <th>Price</th>
              <th>P&amp;L</th>
            </tr>
          </thead>

          <tbody>
            {trades.map((trade) => (
              <tr
                key={trade.id}
                className={
                  trade.profitAndLoss >= 0 ? "green-row" : "red-row"
                }
              >
                <td>{trade.id}</td>
                <td>{trade.contractId}</td>
                <td>${trade.price.toFixed(2)}</td>
                <td
                  style={{
                    color:
                      trade.profitAndLoss >= 0 ? "green" : "red",
                  }}
                >
                  ${trade.profitAndLoss.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}