from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio
import uvicorn
import time

app = FastAPI()

connections = {}

@app.websocket("/ws/alert")
async def websocket_endpoint(websocket: WebSocket):
    session_id = websocket.cookies.get("session_id")

    if not session_id:
        await websocket.close(code=1008, reason="Unauthorized")
        return

    await websocket.accept() 

    connections[session_id] = websocket

    try: 
        data = "Server will restart in 1 minute"
        await websocket.send_text(data)

    except WebSocketDisconnect:
        del connections[session_id]
        pass

if __name__ == "__main__":
    uvicorn.run(app, host="192.168.15.3", port=5001,  proxy_headers=True, forwarded_allow_ips="*")