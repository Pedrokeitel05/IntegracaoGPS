import { useEffect, useRef, useCallback } from 'react';
import type { Module } from '../types';

interface WebSocketMessage {
  type: 'module_update' | 'module_reorder' | 'module_add' | 'module_delete';
  payload: any;
}

interface UseWebSocketProps {
  onModuleUpdate?: (moduleId: string, updates: Partial<Module>) => void;
  onModulesReorder?: (modules: Module[]) => void;
  onModuleAdd?: (module: Module) => void;
  onModuleDelete?: (moduleId: string) => void;
}

export function useWebSocket({
  onModuleUpdate,
  onModulesReorder,
  onModuleAdd,
  onModuleDelete,
}: UseWebSocketProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const isConnectedRef = useRef(false);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    console.log('Connecting to WebSocket:', wsUrl);
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      isConnectedRef.current = true;
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        console.log('WebSocket message received:', message);

        switch (message.type) {
          case 'module_update':
            if (onModuleUpdate) {
              onModuleUpdate(message.payload.moduleId, message.payload.updates);
            }
            break;
          case 'module_reorder':
            if (onModulesReorder) {
              onModulesReorder(message.payload.modules);
            }
            break;
          case 'module_add':
            if (onModuleAdd) {
              onModuleAdd(message.payload.module);
            }
            break;
          case 'module_delete':
            if (onModuleDelete) {
              onModuleDelete(message.payload.moduleId);
            }
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      isConnectedRef.current = false;
      
      // Reconnect after 3 seconds
      setTimeout(() => {
        if (!isConnectedRef.current) {
          connect();
        }
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, [onModuleUpdate, onModulesReorder, onModuleAdd, onModuleDelete]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      console.log('WebSocket message sent:', message);
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
    }
  }, []);

  const broadcastModuleUpdate = useCallback((moduleId: string, updates: Partial<Module>) => {
    sendMessage({
      type: 'module_update',
      payload: { moduleId, updates }
    });
  }, [sendMessage]);

  const broadcastModulesReorder = useCallback((modules: Module[]) => {
    sendMessage({
      type: 'module_reorder',
      payload: { modules }
    });
  }, [sendMessage]);

  const broadcastModuleAdd = useCallback((module: Module) => {
    sendMessage({
      type: 'module_add',
      payload: { module }
    });
  }, [sendMessage]);

  const broadcastModuleDelete = useCallback((moduleId: string) => {
    sendMessage({
      type: 'module_delete',
      payload: { moduleId }
    });
  }, [sendMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected: isConnectedRef.current,
    broadcastModuleUpdate,
    broadcastModulesReorder,
    broadcastModuleAdd,
    broadcastModuleDelete,
  };
}