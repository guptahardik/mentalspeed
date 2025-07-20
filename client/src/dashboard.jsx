const { useEffect, useRef } = React;

function Dashboard() {
  const chartRef = useRef(null);

  useEffect(() => {
    fetch('/api/session', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        const ctx = chartRef.current.getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.map(d => new Date(d.date).toLocaleDateString()),
            datasets: [{ label: 'Score', data: data.map(d => d.score), fill: false, borderColor: 'blue' }]
          }
        });
      });
  }, []);

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Performance</h1>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

ReactDOM.render(<Dashboard />, document.getElementById('root'));
