import React, { useEffect, useRef } from 'react';

const Home = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;

    const config = {
      symbols: [
        { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500 Index' },
        { proName: 'FOREXCOM:NSXUSD', title: 'US 100 Cash CFD' },
        { proName: 'FX_IDC:EURUSD', title: 'EUR to USD' },
        { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
        { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
      ],
      colorTheme: 'dark',
      locale: 'en',
      isTransparent: false,
      showSymbolLogo: true,
      displayMode: 'adaptive',
    };

    const textNode = document.createTextNode(JSON.stringify(config));
    script.appendChild(textNode);

    container.appendChild(script);
  }, []);

  return (
    <div style={styles.container}>
      <div
        className="tradingview-widget-container"
        ref={containerRef}
        style={{ marginBottom: 30 }}
      />
      <h2 style={styles.title}>🏠 Welcome to Trading Hub</h2>
      <p style={styles.subtitle}>
        Navigate using the sidebar to explore charts 📈 and economic calendars 📅.
      </p>

      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h3>📊 Charts</h3>
          <p>View interactive trading charts with real-time price updates.</p>
        </div>
        <div style={styles.card}>
          <h3>🗓️ Calendar</h3>
          <p>Track upcoming economic events that impact the market.</p>
        </div>
        <div style={styles.card}>
          <h3>📰 News</h3>
          <p>Coming soon: Stay informed with live market-moving news.</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#666',
    marginBottom: '30px',
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    width: '260px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
  },
};

export default Home;
