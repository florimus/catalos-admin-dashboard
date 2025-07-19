'use client';

import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { IResponse } from '@/core/types';

export function useStompSubscription(
  topic: string,
  onMessage: (messageBody: IResponse<string | null>) => void
) {
  const stompClientRef = useRef<Client>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (process.env.ENABLE_SOCKET_CONNECTION !== 'true') {
      return;
    }
    const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ws`);

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 0,
      onConnect: () => {
        console.log(`Connected to ${topic}`);

        stompClient.subscribe(topic, (message) => {
          if (onMessageRef.current) {
            onMessageRef.current(
              message.body
                ? (JSON.parse(message.body) as IResponse<string | null>)
                : {
                    success: false,
                    message: 'Failed to parse message',
                  }
            );
          }
        });
      },
      onStompError: (error) => {
        console.log('Stomp error', error);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [topic]);
}
