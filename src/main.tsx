import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { registerSW } from 'virtual:pwa-register';

// Register PWA Service Worker for offline play
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New content available, refreshing SW...');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('Block Blast PWA is ready for offline play.');
  },
  onRegistered(r) {
    console.log('SW Registered successfully with scope:', r?.scope);
  },
  onRegisterError(error) {
    console.error('SW registration error:', error);
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
