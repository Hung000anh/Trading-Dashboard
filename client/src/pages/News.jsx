import React, { useEffect, useRef, memo } from 'react';

const markets = [
  { label: 'Cryptocurrencies', value: 'crypto' },
  { label: 'Currencies', value: 'forex' },
  { label: 'Stocks', value: 'stock' },
  { label: 'Indices', value: 'index' },
  { label: 'Futures', value: 'futures' },
  { label: 'Bonds', value: 'bond' },
];

function News() {
  const containers = useRef([]);

  useEffect(() => {
    containers.current.forEach((container, index) => {
      const { value } = markets[index];

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        displayMode: 'regular',
        feedMode: 'market',
        market: value,
        colorTheme: 'light',
        isTransparent: false,
        locale: 'en',
        width: '100%',
        height: '300',
      });

      if (container) {
        container.innerHTML = ''; // Clear old script if any
        container.appendChild(script);
      }
    });
  }, []);

  return (
    <div style={{ paddingBottom: '50px' }}>
      {markets.map((market, idx) => (
  <div key={market.value} style={{ marginBottom: '40px' }}>
    <h2
      style={{
        color: '#black', // xanh sáng (green-400)
        fontSize: '1.5rem',
        fontWeight: '700',
        marginBottom: '12px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }}
    >
      {market.label}
    </h2>
    <div
      className="tradingview-widget-container"
      ref={(el) => (containers.current[idx] = el)}
    />
  </div>
))}
    </div>
  );
}

export default memo(News);
