import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // Check if running on iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isIOSDevice && !isStandalone) {
      setIsIOS(true);
      // Check if user previously dismissed iOS install tip
      const dismissed = sessionStorage.getItem('bb_ios_prompt_dismissed');
      if (!dismissed) {
        setShowIOSPrompt(true);
      }
    }

    // Android / Chromium beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const dismissIOSPrompt = () => {
    setShowIOSPrompt(false);
    sessionStorage.setItem('bb_ios_prompt_dismissed', 'true');
  };

  // Chromium Install Banner
  if (showPrompt && deferredPrompt) {
    return (
      <div
        style={{
          position: 'absolute',
          top: 'max(10px, env(safe-area-inset-top))',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 500,
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-focus)',
          borderRadius: '999px',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: 'var(--shadow-md)',
          cursor: 'pointer',
        }}
        onClick={handleInstall}
      >
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
          📲 Install App
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPrompt(false);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0 2px',
          }}
          aria-label="Dismiss install prompt"
        >
          ×
        </button>
      </div>
    );
  }

  // iOS Safari "Add to Home Screen" Banner
  if (isIOS && showIOSPrompt) {
    return (
      <div
        style={{
          position: 'absolute',
          bottom: 'max(16px, env(safe-area-inset-bottom))',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '380px',
          zIndex: 500,
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--accent-primary)',
          borderRadius: '16px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Install on iPhone
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            Tap <strong style={{ color: 'var(--accent-primary)' }}>Share</strong> then <strong style={{ color: 'var(--accent-primary)' }}>Add to Home Screen</strong> ⊞
          </span>
        </div>

        <button
          onClick={dismissIOSPrompt}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '1.2rem',
            lineHeight: 1,
            cursor: 'pointer',
            padding: '4px',
          }}
          aria-label="Dismiss iOS install tip"
        >
          ×
        </button>
      </div>
    );
  }

  return null;
};
