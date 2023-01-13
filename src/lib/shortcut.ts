export const shortcut = (node, params) => {
  let handler;
  const removeHandler = () => window.removeEventListener('keydown', handler), setHandler = () => {
      removeHandler();
      if (!params)
          return;
      handler = (e) => {
        console.log("click",e)
        for (const element of params) {
          if (((!!element.alt != e.altKey) ||
              (!!element.shift != e.shiftKey) ||
              (!!element.control != (e.ctrlKey || e.metaKey)) && !e.code) 
              ) {
              return;
          } else {
            if (e.code == element.code) {
              e.preventDefault();
              element.callback ? element.callback() : node.click();
            }
          }
          
          // if (element.control && e.code === "KeyC" && ) {
          //   e.preventDefault();

          // params.callback ? params.callback() : node.click();
        }
          // if ((!!params.alt != e.altKey) ||
          //     (!!params.shift != e.shiftKey) ||
          //     (!!params.control != (e.ctrlKey || e.metaKey)) ||
          //     params.code != e.code)
          //     return;
          // e.preventDefault();
          // params.callback ? params.callback() : node.click();
      };
      window.addEventListener('keydown', handler);
  };
  setHandler();
  return {
      update: setHandler,
      destroy: removeHandler,
  };
};
