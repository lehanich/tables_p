onmessage = () => {
  console.log('Hello World 👋');

  postMessage({});
};
// self.addEventListener('message', () => {
//   self.postMessage('pong');
// });

export {};