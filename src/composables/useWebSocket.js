import { ref, onMounted, onBeforeUnmount } from 'vue';
import webSocketService from '@/services/WebSocketService';

export default function useWebSocket(serverUrl = import.meta.env.VITE_APP_WEBSOCKET_URL) {
  const isConnected = ref(false);
  const subscriptions = ref([]);

  const connect = () => {
    webSocketService.connect(
      serverUrl,
      () => {
        isConnected.value = true;
      },
      (error) => {
        isConnected.value = false;
        console.error('WebSocket connection error:', error);
      }
    );
  };

  const subscribe = (topic, callback) => {
    const subscription = webSocketService.subscribe(topic, callback);
    subscriptions.value.push(subscription);
    return subscription;
  };

  const send = (destination, body) => {
    webSocketService.send(destination, body);
  };

  const disconnect = () => {
    subscriptions.value.forEach(subscription => {
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
      }
    });
    subscriptions.value = [];
    webSocketService.disconnect();
    isConnected.value = false;
  };

  onMounted(() => {
    connect();
  });

  onBeforeUnmount(() => {
    disconnect();
  });

  return {
    isConnected,
    subscribe,
    send,
    disconnect,
    connect
  };
}