import useStrife from '@strifeapp/strife';

window.self !== window.top ? useStrife() : null;

console.log('Hello World');
