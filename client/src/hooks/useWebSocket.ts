import { useEffect, useRef, useCallback } from "react";
import type { Module } from "../types";

interface WebSocketMessage {
  type: "module_update" | "module_reorder" | "module_add" | "module_delete";
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
  onDeleteModule,
}: UseWebSocketProps) {
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    console.log("A ligar ao WebSocket do utilizador:", wsUrl);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => console.log("WebSocket do utilizador ligado");
    ws.onclose = () => setTimeout(() => connect(), 3000);
    ws.onerror = (error) =>
      console.error("Erro no WebSocket do utilizador:", error);
    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        switch (message.type) {
          case "module_update":
            if (onModuleUpdate)
              onModuleUpdate(message.payload.moduleId, message.payload.updates);
            break;
          case "module_reorder":
            if (onModulesReorder) onModulesReorder(message.payload.modules);
            break;
          case "module_add":
            if (onModuleAdd) onModuleAdd(message.payload.module);
            break;
          case "module_delete":
            if (onDeleteModule) onDeleteModule(message.payload.moduleId);
            break;
        }
      } catch (error) {
        console.error("Erro ao processar a mensagem WebSocket:", error);
      }
    };
  }, [onModuleUpdate, onModulesReorder, onModuleAdd, onDeleteModule]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN)
      wsRef.current.send(JSON.stringify(message));
  }, []);
  const broadcastModuleUpdate = useCallback(
    (moduleId: string, updates: Partial<Module>) =>
      sendMessage({ type: "module_update", payload: { moduleId, updates } }),
    [sendMessage],
  );
  const broadcastModulesReorder = useCallback(
    (modules: Module[]) =>
      sendMessage({ type: "module_reorder", payload: { modules } }),
    [sendMessage],
  );
  const broadcastModuleAdd = useCallback(
    (module: Module) =>
      sendMessage({ type: "module_add", payload: { module } }),
    [sendMessage],
  );
  const broadcastModuleDelete = useCallback(
    (moduleId: string) =>
      sendMessage({ type: "module_delete", payload: { moduleId } }),
    [sendMessage],
  );

  return {
    broadcastModuleUpdate,
    broadcastModulesReorder,
    broadcastModuleAdd,
    broadcastModuleDelete,
  };
}
