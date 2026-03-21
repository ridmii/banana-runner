const GOOGLE_CLIENT_ID = '367672186493-b3npbfm8ke6vpoms2irel1i55m4ck1ja.apps.googleusercontent.com';
let googleInitialized = false;
let googleInitPromise = null;

export function initializeGoogle(callback) {
  // If already initialized, just set the callback
  if (googleInitialized && window.google?.accounts?.id) {
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback,
      });
    } catch (e) {
      console.warn('Google reinit warning:', e.message);
    }
    return Promise.resolve();
  }

  // If already initializing, wait for it
  if (googleInitPromise) {
    return googleInitPromise;
  }

  // Start initialization
  googleInitPromise = new Promise((resolve) => {
    if (window.google?.accounts?.id) {
      // Script already loaded
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback,
        });
        googleInitialized = true;
      } catch (e) {
        console.warn('Google init error:', e.message);
      }
      resolve();
      return;
    }

    // Load script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback,
          });
          googleInitialized = true;
        } catch (e) {
          console.warn('Google script loaded but init failed:', e.message);
        }
      }
      resolve();
    };
    script.onerror = () => {
      console.error('Failed to load Google Sign-In script');
      resolve();
    };
    document.body.appendChild(script);
  });

  return googleInitPromise;
}

export const GOOGLE_CLIENT_ID_EXPORT = GOOGLE_CLIENT_ID;
