import { makeNewSegmentNotification } from './notificationHelpers';
import { addNotifications } from '../actions';

let webSockets = {};

export const openWebSocket = (name, url, dispatch) => {
  const wsUrl = url.replace('http', 'ws');
  const { [name]: prevWS } = webSockets;
  if (prevWS) {
    prevWS.close();
  }
  const ws = new WebSocket(wsUrl);

  ws.onmessage = payload => {
    try {
      const { type, data } = JSON.parse(payload.data);
      if (type === 'didSave') {
        dispatch(addNotifications([makeNewSegmentNotification(data)]));
      }
    } catch (e) {
      // do nothing
    }
  };
  webSockets = { ...webSockets, [name]: ws };
};

export const closeWebSocket = name => {
  const { [name]: ws, ...rest } = webSockets;
  if (ws) {
    ws.close();
  }
  webSockets = rest;
};

export const closeAllWebSockets = () => {
  Object.values(webSockets).forEach(ws => ws.close());
  webSockets = {};
};
