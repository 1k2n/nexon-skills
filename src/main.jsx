import React from 'https://esm.sh/react@18.2.0?dev';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client?dev';
import { App } from 'app.jsx';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
