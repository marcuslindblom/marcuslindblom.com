import { ready } from '@strifeapp/strife';
ready();
// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("/sw.js")
//       .then(function (registration) {
//           console.log("Service Worker registered with scope:",
//                        registration.scope);
//       }).catch(function (err) {
//       console.log("Service worker registration failed:", err);
//   });
// }


// if ("serviceWorker" in navigator && "SyncManager" in window) {
//   console.log("SyncManager supported");
//   navigator.serviceWorker.ready.then(function(registration) {
//       registration.sync.register("sync-videos");
//   });
// } else {
//   console.log("Sync not supported");
// }