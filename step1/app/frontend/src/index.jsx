import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const [health, setHealth] = React.useState(null);
  const [hello, setHello] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/health').then(r => r.json()).then(setHealth).catch(console.error);
    fetch('/api/hello').then(r => r.json()).then(setHello).catch(console.error);
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', margin: 24 }}>
      <h1>Konovator Test — React Frontend</h1>
      <p>This app is served behind Nginx reverse proxy.</p>
      <pre>Health: {JSON.stringify(health, null, 2)}</pre>
      <pre>Hello: {JSON.stringify(hello, null, 2)}</pre>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
