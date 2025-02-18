export function useBroadCastChannel(name: string) {
  // TODO: connect to broadcast channel or create new if not exists
  const broadcastChannel = new BroadcastChannel(name);
  const listeners = new Set();

  const getChannel = () => {
    return broadcastChannel;
  };

  const closeChannel = () => {
    broadcastChannel?.close();
    listeners.clear();
  };

  const postMessage = (message: string) => {
    broadcastChannel.postMessage(message);
  };

  const addEventListener = (
    callback: (message: unknown) => void,
  ) => {
    if (
      typeof callback === 'function' &&
      !listeners.has(callback)
    ) {
      broadcastChannel.addEventListener(
        'message',
        callback,
      );
      listeners.add(callback);
    }
  };

  const removeEventListener = (
    callback: (message: unknown) => void,
  ) => {
    if (listeners.has(callback)) {
      broadcastChannel.removeEventListener(
        'message',
        callback,
      );
      listeners.delete(callback);
    }
  };

  return {
    getChannel,
    closeChannel,
    postMessage,
    addEventListener,
    removeEventListener,
    listeners,
  };
}
