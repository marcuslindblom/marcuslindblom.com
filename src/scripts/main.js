import { ready } from '@strifeapp/strife';
ready();

// Register service worker

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("./service-worker.js", {
        scope: "/",
      });
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
        triggerSyncEvent();
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

registerServiceWorker();

// Listen for the online event
window.addEventListener('online', function(event) {
  console.log('You are online');
  // When online, trigger the sync event
  triggerSyncEvent();
});

function triggerSyncEvent() {
  // Check if service worker is supported by the browser
  if ('serviceWorker' in navigator) {
    // Register the service worker
    navigator.serviceWorker.ready
      .then(function(registration) {
        console.log('Service worker is ready');
        // Trigger a sync event with the tag 'syncData'
        return registration.sync.register('syncData');
      })
      .catch(function(err) {
        console.error('Service worker sync registration failed:', err);
      });
  }
}