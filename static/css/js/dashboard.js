const dashboardDataElement = document.getElementById('dashboard-data');
const dashboardData = dashboardDataElement ? JSON.parse(dashboardDataElement.textContent) : { stats: {}, labels: [], counts: [] };
const { stats = {}, labels = [], counts = [] } = dashboardData;

Chart.defaults.color = '#999';
Chart.defaults.borderColor = 'rgba(255,255,255,0.05)';

new Chart(document.getElementById('pieChart'), {
  type: 'doughnut',
  data: {
    labels: ['Safe', 'Warning', 'Dangerous'],
    datasets: [{
      data: [stats.safe || 0, stats.warning || 0, stats.danger || 0],
      backgroundColor: ['#2E7D32', '#FF6F00', '#D32F2F'],
      borderWidth: 2,
      borderColor: '#1a1a1a'
    }]
  },
  options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
});

new Chart(document.getElementById('barChart'), {
  type: 'bar',
  data: {
    labels: ['Safe', 'Warning', 'Dangerous', 'Alerts'],
    datasets: [{
      label: 'Count',
      data: [stats.safe || 0, stats.warning || 0, stats.danger || 0, stats.alerts || 0],
      backgroundColor: ['#2E7D32', '#FF6F00', '#D32F2F', '#FFC107'],
      borderRadius: 6
    }]
  },
  options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
});

new Chart(document.getElementById('lineChart'), {
  type: 'line',
  data: {
    labels: labels || [],
    datasets: [{
      label: 'Predictions',
      data: counts || [],
      borderColor: '#FFC107',
      backgroundColor: 'rgba(255,193,7,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#FF6F00',
      pointRadius: 5
    }]
  },
  options: { responsive: true, scales: { y: { beginAtZero: true } } }
});