import useStrife from '@strifeapp/strife';

useStrife();
// window.self !== window.top ? useStrife() : null;

// if(window.self !== window.top) useStrife();

// console.clear();

// const featuresEl = document.querySelector('.features');
// if (featuresEl) {
//   const featureEls = document.querySelectorAll('.feature');

//   featuresEl.addEventListener('pointermove', (ev) => {
//     featureEls.forEach((featureEl) => {
//       // Not optimized yet, I know
//       const rect = featureEl.getBoundingClientRect();

//       featureEl.style.setProperty('--x', ev.clientX - rect.left);
//       featureEl.style.setProperty('--y', ev.clientY - rect.top);
//     });
//   });
// }
