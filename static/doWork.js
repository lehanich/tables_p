// onmessage = () => {
//   console.log('Hello World 👋');
// };
self.addEventListener('message', () => {
  self.postMessage('pong');
});

// export {};