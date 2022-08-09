import useStrife from '@strifeapp/strife';

window.self !== window.top ? useStrife() : null;


console.clear();
const featuresEl = document.querySelector(".features");
const featureEls = document.querySelectorAll(".feature");

featuresEl.addEventListener("pointermove", (ev) => {
  featureEls.forEach((featureEl) => {
    // Not optimized yet, I know
    const rect = featureEl.getBoundingClientRect();

    featureEl.style.setProperty("--x", ev.clientX - rect.left);
    featureEl.style.setProperty("--y", ev.clientY - rect.top);
  });
});