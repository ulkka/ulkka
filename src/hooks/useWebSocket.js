import {useEffect, useRef} from 'react';

const useWebSocket = ({url, onOpen, onError, onClose, onMessage}) => {
  const ws = useRef(new WebSocket(url)).current;

  useEffect(() => {
    ws.onopen = e => {
      console.log('WebSocket Client Connected');
      if (onOpen) {
        onOpen(e);
      }
    };
    ws.onclose = e => {
      console.log('WebSocket Client Closed');
      if (onClose) {
        onClose(e);
      }
    };
    ws.onerror = e => {
      console.error(e);
      if (onError) {
        onError(e);
      }
    };
    ws.onmessage = e => {
      if (onMessage) {
        onMessage(e);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ws,
  };
};

export default useWebSocket;
