import { useAppStore } from '../state/store';

class PWAManager {
  private swRegistration: ServiceWorkerRegistration | null = null;
  private updateAvailable = false;

  async register(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', this.swRegistration);

      // Listen for updates
      this.swRegistration.addEventListener('updatefound', () => {
        const newWorker = this.swRegistration!.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.updateAvailable = true;
              useAppStore.getState().setPWAState({ updateAvailable: true });
            }
          });
        }
      });

      // Listen for controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        this.updateAvailable = false;
        useAppStore.getState().setPWAState({ updateAvailable: false });
        window.location.reload();
      });

      // Check if already installed
      this.checkInstallationStatus();

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  private checkInstallationStatus(): void {
    // Check if running as standalone app
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    
    useAppStore.getState().setPWAState({ isInstalled: isStandalone });
  }

  async update(): Promise<void> {
    if (this.swRegistration && this.updateAvailable) {
      try {
        await this.swRegistration.update();
        console.log('Service Worker update initiated');
      } catch (error) {
        console.error('Service Worker update failed:', error);
      }
    }
  }

  async unregister(): Promise<void> {
    if (this.swRegistration) {
      try {
        await this.swRegistration.unregister();
        console.log('Service Worker unregistered');
      } catch (error) {
        console.error('Service Worker unregistration failed:', error);
      }
    }
  }

  async clearCache(): Promise<void> {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('All caches cleared');
        
        // Notify service worker to clear its caches
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'CLEAR_CACHE'
          });
        }
      } catch (error) {
        console.error('Cache clearing failed:', error);
      }
    }
  }

  // Install prompt handling
  private deferredPrompt: any = null;

  setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      
      // Show install button or notification
      console.log('Install prompt available');
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      useAppStore.getState().setPWAState({ isInstalled: true });
      console.log('PWA installed');
    });
  }

  async showInstallPrompt(): Promise<boolean> {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      return outcome === 'accepted';
    }
    return false;
  }

  // Network status monitoring
  setupNetworkMonitoring(): void {
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine;
      useAppStore.getState().setPWAState({ isOnline });
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial check
    updateOnlineStatus();
  }

  // Get app info
  getAppInfo() {
    return {
      isInstalled: useAppStore.getState().pwa.isInstalled,
      isOnline: useAppStore.getState().pwa.isOnline,
      updateAvailable: this.updateAvailable,
      canInstall: !!this.deferredPrompt,
    };
  }
}

export const pwaManager = new PWAManager();
export default pwaManager;