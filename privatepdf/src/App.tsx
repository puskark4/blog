import { useEffect } from 'react';
import { useAppStore } from './modules/state/store';
import pwaManager from './modules/pwa/pwa-manager';
import AppShell from './components/AppShell';
import FileDropZone from './components/FileDropZone';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBanner from './components/ErrorBanner';
import OfflineStatus from './components/OfflineStatus';

function App() {
  const { 
    document, 
    isLoading, 
    error, 
    pwa,
    setPWAState 
  } = useAppStore();

  useEffect(() => {
    // Initialize PWA
    pwaManager.register();
    pwaManager.setupInstallPrompt();
    pwaManager.setupNetworkMonitoring();

    // Set initial PWA state
    setPWAState({
      isOnline: navigator.onLine,
      isInstalled: window.matchMedia('(display-mode: standalone)').matches ||
                   (window.navigator as any).standalone === true,
    });
  }, [setPWAState]);

  // Show offline status banner
  if (!pwa.isOnline) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <OfflineStatus />
      </div>
    );
  }

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error banner if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorBanner error={error} />
        <div className="flex items-center justify-center min-h-screen">
          <FileDropZone />
        </div>
      </div>
    );
  }

  // Show file drop zone if no document is loaded
  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FileDropZone />
      </div>
    );
  }

  // Show main editor interface
  return (
    <div className="min-h-screen bg-gray-50">
      <AppShell />
    </div>
  );
}

export default App;
