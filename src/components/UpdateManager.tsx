import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export const UpdateManager: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('Updating to the latest version...');

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      if (!registration) return;

      const triggerUpdateCheck = () => {
        if (navigator.onLine) {
          registration.update().catch(err => {
            console.warn('[PWA] Background update check failed:', err);
          });
        }
      };

      // 1. Initial check shortly after app starts
      setTimeout(triggerUpdateCheck, 3000);

      // 2. Check for updates on online reconnection
      const handleOnline = () => {
        console.log('[PWA] Network reconnected online. Checking for new version...');
        triggerUpdateCheck();
      };

      // 3. Check for updates on visibility change (app resumed or tab active)
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          triggerUpdateCheck();
        }
      };

      // 4. Check on window focus
      const handleFocus = () => {
        triggerUpdateCheck();
      };

      window.addEventListener('online', handleOnline);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleFocus);

      // 5. Periodic check every 30 minutes
      const intervalId = setInterval(triggerUpdateCheck, 30 * 60 * 1000);

      // 6. Watch for installing worker to trigger the subtle "Updating to the latest version..." indicator
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          setIsUpdating(true);
          setUpdateMessage('Updating to the latest version...');

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateMessage('Updating to the latest version...');
            }
          });
        }
      });

      return () => {
        window.removeEventListener('online', handleOnline);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleFocus);
        clearInterval(intervalId);
      };
    },
    onRegisterError(error) {
      console.error('[PWA] SW registration error:', error);
    },
  });

  // When needRefresh is triggered by vite-plugin-pwa, auto-apply the update
  useEffect(() => {
    if (needRefresh) {
      setIsUpdating(true);
      setUpdateMessage('Updating to the latest version...');
      updateServiceWorker(true).then(() => {
        setNeedRefresh(false);
      });
    }
  }, [needRefresh, updateServiceWorker, setNeedRefresh]);

  // Listen for controllerchange: new service worker has claimed clients
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.serviceWorker) return;

    let refreshing = false;
    const handleControllerChange = () => {
      if (refreshing) return;
      refreshing = true;

      // Anti-infinite refresh loop guard
      const LAST_RELOAD_KEY = 'blockblast_pwa_last_reload';
      try {
        const lastReload = parseInt(sessionStorage.getItem(LAST_RELOAD_KEY) || '0', 10);
        const now = Date.now();
        if (now - lastReload < 15000) {
          console.log('[PWA] Suppressing rapid duplicate reload.');
          setIsUpdating(false);
          return;
        }
        sessionStorage.setItem(LAST_RELOAD_KEY, now.toString());
      } catch {
        // Ignore session storage errors
      }

      setIsUpdating(true);
      setUpdateMessage('Updating to the latest version...');

      // Smooth clean reload to fetch latest assets
      setTimeout(() => {
        window.location.reload();
      }, 500);
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  if (!isUpdating) return null;

  return (
    <div
      className="pwa-updating-banner"
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 'max(12px, env(safe-area-inset-top))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: 'rgba(18, 22, 31, 0.92)',
        border: '1px solid var(--accent-primary)',
        boxShadow: '0 8px 24px var(--accent-glow), 0 4px 12px rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '999px',
        padding: '6px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: 'modalFadeIn 0.25s ease-out',
      }}
    >
      <div
        className="updating-spinner"
        style={{
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.25)',
          borderTopColor: 'var(--accent-primary)',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '0.02em',
        }}
      >
        {updateMessage}
      </span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
