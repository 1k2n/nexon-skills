import React from 'https://esm.sh/react@18.2.0?dev';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client?dev';
import * as LucideReact from 'https://esm.sh/lucide-react@0.292.0?dev';

window.React = React;
window.ReactDOMClient = { createRoot };
window.LucideReact = LucideReact;
window.AppData = window.AppData || {};
window.AppComponents = window.AppComponents || {};
