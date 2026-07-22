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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-zinc-100">
          Journal & Trade Logs
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Review your historical trades and performance.
        </p>
      </div>

      {/* Account Selector */}
      <div className="rounded-xl border bg-zinc-900 border-zinc-800 p-4 shadow-sm">
        <label className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            Account
          </span>

          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"          >
            <option value="">Select an account</option>

            {accounts?.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name ?? account.id}
              </option>
            ))}
          </select>
        </label>
      </div>

      {tradesLoading && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-700">
          Loading trades...
        </div>
      )}

      {tradesError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Error loading trades: {tradesError.message}
        </div>
      )}

      {trades && (
        <div className="overflow-hidden rounded-xl border bg-zinc-900 border-zinc-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-700">
              <thead className="bg-zinc-800">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-900 border-zinc-800">
                  <th className="px-6 py-3">Trade ID</th>
                  <th className="px-6 py-3">Contract</th>
                  <th className="px-6 py-3">Entry</th>
                  <th className="px-6 py-3">Exit</th>
                  <th className="px-6 py-3">Entry Price</th>
                  <th className="px-6 py-3">Exit Price</th>
                  <th className="px-6 py-3">P&amp;L</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800">
                {trades.map((trade) => (
                  <tr
                    key={trade.tradeId}
                    className={`transition hover:bg-zinc-800 ${
                      trade.profitAndLoss >= 0
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-zinc-100">
                      {trade.tradeId}
                    </td>

                    <td className="px-6 py-4 font-mono text-zinc-300">
                      {trade.contractId}
                    </td>

                    <td className="px-6 py-4 text-zinc-400">
                      {trade.entryTimestamp}
                    </td>

                    <td className="px-6 py-4 text-zinc-400">
                      {trade.exitTimestamp}
                    </td>

                    <td className="px-6 py-4">
                      ${trade.entryPrice.toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      ${trade.exitPrice.toFixed(2)}
                    </td>
                    <td
                      className={`px-6 py-4 font-semibold ${
                        trade.profitAndLoss >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ${trade.profitAndLoss.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

}