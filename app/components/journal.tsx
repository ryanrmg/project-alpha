import { useQuery } from '@tanstack/react-query';

// 1. Define the fetcher function pointing to your Go backend
const fetchUserTrades = async (accountId) => {
  const response = await fetch(`http://localhost:8080/api/trades?accountId=${accountId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // Returns the array of GatewayUserTrade items
};

export default function Journal({ accountId }) {
  // 2. Use React Query to manage the API lifecycle
  const { data: trades, isLoading, error } = useQuery({
    queryKey: ['trades', accountId],
    queryFn: () => fetchUserTrades(accountId),
  });

  if (isLoading) return <div>Loading trade logs...</div>;
  if (error) return <div>Error loading metrics: {error.message}</div>;

  return (
    <div className="trade-container">
      <h2>Journal & Trade Logs</h2>
      <table>
        <thead>
          <tr>
            <th>Trade ID</th>
            <th>Contract</th>
            <th>Price</th>
            <th>P&L</th>
          </tr>
        </thead>
        <tbody>
          {/* 3. Map through the JSON array and render rows dynamically */}
          {trades?.map((trade) => (
            <tr key={trade.id} className={trade.profitAndLoss >= 0 ? 'green-row' : 'red-row'}>
              <td>{trade.id}</td>
              <td>{trade.contractId}</td>
              <td>${trade.price.toFixed(2)}</td>
              <td style={{ color: trade.profitAndLoss >= 0 ? 'green' : 'red' }}>
                ${trade.profitAndLoss.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}