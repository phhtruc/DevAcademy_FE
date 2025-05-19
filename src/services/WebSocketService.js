// import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client'; // Import SockJS

// class WebSocketService {
//   constructor() {
//     this.stompClient = null;
//     this.connected = false;
//     this.subscribers = new Map();
//     this.reconnectTimeout = null;
//     this.reconnectDelay = 5000; // 5 giây
//   }

//   connect(serverUrl, onConnected, onError) {
//     // Tạo kết nối với SockJS
//     const socket = new SockJS(serverUrl); // Sử dụng SockJS để kết nối

//     this.stompClient = new Client({
//       webSocketFactory: () => socket, // Sử dụng SockJS làm factory
//       debug: function (str) {
//         console.log('[STOMP Debug]:', str);
//       },
//       reconnectDelay: 5000,
//       heartbeatIncoming: 4000,
//       heartbeatOutgoing: 4000,
//     });

//     // Xử lý khi kết nối thành công
//     this.stompClient.onConnect = (frame) => {
//       this.connected = true;
//       console.log('Connected to WebSocket:', frame);

//       // Kích hoạt các subscribers đã đăng ký
//       this.subscribers.forEach((callback, topic) => {
//         this._subscribe(topic, callback);
//       });

//       if (onConnected) onConnected(frame);
//     };

//     // Xử lý khi mất kết nối
//     this.stompClient.onStompError = (frame) => {
//       console.error('WebSocket Error:', frame);
//       this.connected = false;

//       if (onError) onError(frame);

//       // Thử kết nối lại sau một khoảng thời gian
//       this._scheduleReconnect();
//     };

//     // Xử lý khi ngắt kết nối
//     this.stompClient.onDisconnect = () => {
//       console.log('WebSocket Disconnected');
//       this.connected = false;

//       // Thử kết nối lại sau một khoảng thời gian
//       this._scheduleReconnect();
//     };

//     // Kích hoạt kết nối
//     this.stompClient.activate();
//   }

//   // Đăng ký nhận thông báo từ một topic
//   subscribe(topic, callback) {
//     this.subscribers.set(topic, callback);

//     // Nếu đã kết nối, đăng ký ngay lập tức
//     if (this.connected && this.stompClient) {
//       this._subscribe(topic, callback);
//     }

//     return {
//       unsubscribe: () => this.unsubscribe(topic),
//     };
//   }

//   // Hủy đăng ký
//   unsubscribe(topic) {
//     if (this.subscribers.has(topic)) {
//       this.subscribers.delete(topic);
//     }
//   }

//   // Thực tế đăng ký với STOMP
//   _subscribe(topic, callback) {
//     return this.stompClient.subscribe(topic, (message) => {
//       try {
//         const data = JSON.parse(message.body);
//         callback(data);
//       } catch (error) {
//         console.error('Error parsing WebSocket message:', error);
//         callback(message.body);
//       }
//     });
//   }

//   // Gửi tin nhắn đến server
//   send(destination, body = {}) {
//     if (this.connected && this.stompClient) {
//       this.stompClient.publish({
//         destination,
//         body: JSON.stringify(body),
//       });
//     } else {
//       console.warn('Cannot send message, WebSocket not connected');
//     }
//   }

//   // Ngắt kết nối
//   disconnect() {
//     if (this.stompClient) {
//       this.stompClient.deactivate();
//     }
//     this.connected = false;

//     // Xóa bất kỳ lịch kết nối lại nào
//     if (this.reconnectTimeout) {
//       clearTimeout(this.reconnectTimeout);
//       this.reconnectTimeout = null;
//     }
//   }

//   // Thử kết nối lại sau một khoảng thời gian
//   _scheduleReconnect() {
//     if (!this.reconnectTimeout) {
//       this.reconnectTimeout = setTimeout(() => {
//         console.log('Attempting to reconnect WebSocket...');
//         this.reconnectTimeout = null;
//         this.stompClient.activate();
//       }, this.reconnectDelay);
//     }
//   }

//   // Kiểm tra trạng thái kết nối
//   isConnected() {
//     return this.connected;
//   }
// }

// // Tạo một instance duy nhất
// const webSocketService = new WebSocketService();

// export default webSocketService;

import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

const serverUrl = import.meta.env.VITE_APP_WEBSOCKET_URL;

export default class WebSocketService {
  constructor(endpoint = serverUrl) {
    this.endpoint = endpoint
    this.stompClient = null
    this.connected = false
    this.subscriptions = {}
  }

  connect(onConnectedCallback = null) {
    return new Promise((resolve, reject) => {
      const socket = new SockJS(this.endpoint)
      this.stompClient = Stomp.over(socket)
      this.stompClient.connect({}, frame => {
        this.connected = true
        console.log('WebSocket connected:', frame)
        if (onConnectedCallback) onConnectedCallback(frame)
        resolve()
      }, error => {
        console.error('WebSocket connection error:', error)
        reject(error)
      })
    })
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      this.stompClient.disconnect(() => {
        console.log('WebSocket disconnected')
        this.connected = false
      })
    }
  }

  send(destination, payload) {
    if (this.stompClient && this.connected) {
      this.stompClient.send(destination, {}, JSON.stringify(payload))
    }
  }

  subscribe(destination, callback) {
    if (this.stompClient && this.connected) {
      const subscription = this.stompClient.subscribe(destination, message => {
        callback(JSON.parse(message.body))
      })
      this.subscriptions[destination] = subscription
    }
  }

  unsubscribe(destination) {
    const subscription = this.subscriptions[destination]
    if (subscription) {
      subscription.unsubscribe()
      delete this.subscriptions[destination]
    }
  }
}
