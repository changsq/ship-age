import { Message } from 'element-ui';

let reconnectInterval = 1000; // 初始重连间隔时间 (毫秒)
const maxReconnectInterval = 30000; // 最大重连间隔时间 (毫秒)
let reconnectAttempts = 0; // 重连尝试次数

function websocketonmessage(e, messageCallback) {
  messageCallback(JSON.parse(e.data)); // 回调函数处理数据
}

function websocketclose(e, errorCallback, ws) {
  if (e && e.code !== 1000) {
    if (errorCallback) errorCallback(); // 错误回调
  }
  attemptReconnect(ws); // 尝试重连
}

function websocketOpen(e, websock, token) {
  // 重置重连参数
  reconnectInterval = 1000;
  reconnectAttempts = 0;
}

function initWebSocket(wsUrl, successCallback, token, errorCallback) {
  if (typeof WebSocket === 'undefined') {
    Message.error('您的浏览器不支持WebSocket,无法获取数据');
    return null;
  }

  const websock = new WebSocket(wsUrl);

  websock.onmessage = function (e) {
    websocketonmessage(e, successCallback);
  };

  websock.onopen = function (e) {
    websocketOpen(e, websock, token);
  };
  let count = 0;
  websock.onerror = function (e) {
    if (count === 0) { Message.error('ws连接异常,请稍候重试'); count++; }
    if (errorCallback) errorCallback(e);
    attemptReconnect(websock); // 尝试重连
  };

  websock.onclose = function (e) {
    websocketclose(e, errorCallback, websock);
  };

  return websock;
}

function attemptReconnect(websock) {
  if (websock.readyState === WebSocket.CLOSED || websock.readyState === WebSocket.CLOSING) {
    setTimeout(() => {
      // 创建新的 WebSocket 实例
      const newWebsock = initWebSocket(websock.url, websock.successCallback, websock.token, websock.errorCallback);
      if (newWebsock) {
        // 成功创建新实例后更新原实例引用
        Object.assign(websock, newWebsock);
      }
      reconnectAttempts++;
      // 使用指数退避算法调整重连间隔
      reconnectInterval = Math.min(reconnectInterval * 2, maxReconnectInterval);
    }, reconnectInterval);
  }
}

/**
 * 发起websocket请求函数
 * @param {string} url ws连接地址
 * @param {function} successCallback 接收到ws数据，对数据进行处理的回调函数
 * @param {string} token 认证token
 * @param {function} errCallback ws连接错误的回调函数
 */
export function sendWebsocket(url, successCallback, token, errCallback) {
  return initWebSocket(url, successCallback, token, errCallback);
}

/**
 * 关闭websocket函数
 */
export function closeWebsocket(websock) {
  if (websock) {
    websock.close();
    console.log('关闭');// 关闭websocket
  }
}