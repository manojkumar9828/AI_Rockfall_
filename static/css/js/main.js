// Main JavaScript for RockGuard AI
// Handles flash message auto-dismiss and UI interactions

document.addEventListener('DOMContentLoaded', function () {
  // Auto-dismiss flash messages after 4 seconds
  const flashContainer = document.querySelector('.flash-container');
  if (flashContainer) {
    setTimeout(() => {
      flashContainer.style.transition = 'opacity 0.5s ease';
      flashContainer.style.opacity = '0';
      setTimeout(() => flashContainer.remove(), 500);
    }, 4000);
  }

  // Animate stat values on load
  const statValues = document.querySelectorAll('.stat-value');
  statValues.forEach(el => {
    const target = parseInt(el.textContent) || 0;
    if (target === 0) return;
    let current = 0;
    const step = Math.ceil(target / 30);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      el.textContent = current;
    }, 30);
  });

  // Animate confidence bars on load
  const bars = document.querySelectorAll('.confidence-bar-fill');
  bars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = width; }, 100);
  });
});
