const appRoots = {};

export const removeRoot = (key) => {
  delete appRoots[key];
};

export const addElementToCache = (element, key, data = {}, onRemove = null) => {
  appRoots[key] = {
    element,
    data,
  };

  if (element?.addEventListener) {
    let detachTimeoutId;

    element.addEventListener("flotiq.attached", () => {
      if (detachTimeoutId) {
        clearTimeout(detachTimeoutId);
        detachTimeoutId = null;
      }
    });

    element.addEventListener("flotiq.detached", () => {
      detachTimeoutId = setTimeout(() => {
        removeRoot(key);
        onRemove?.();
      }, 50);
    });
  }
};

export const updateDataInCache = (key, newData) => {
  if (appRoots[key]) {
    appRoots[key].data = newData;
  }
};

export const getCachedElement = (key) => {
  return appRoots[key];
};

export const registerFn = (pluginInfo, callback) => {
  if (window.FlotiqPlugins?.add) {
    window.FlotiqPlugins.add(pluginInfo, callback);
    return;
  }
  if (!window.initFlotiqPlugins) window.initFlotiqPlugins = [];
  window.initFlotiqPlugins.push({ pluginInfo, callback });
};
