from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from database_ import postgres_database
import asyncio
import uvicorn
import time

app = FastAPI()

connections = {}

@app.websocket("/ws/alert")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    session_id = websocket.cookies.get("session_id")

    if not session_id:
        await websocket.close(code=1008, reason="Unauthorized")
        return

    role = postgres_database().get_user_role_by_session(session_id)

    if not role:
        await websocket.close(code=1008, reason="Unauthorized")
        return

    connections[session_id] = {"websocket": websocket, "user_role": role.get("user_role")}

    try: 
        if connections[session_id]["user_role"] == "admin":
            await websocket.send_text("You are authorized to send message")

            while True:
                data = await websocket.receive_text()

                print(f"Received message from admin: {data}")

                for client in connections:
                    await connections[client]["websocket"].send_text(data)
        
        else:
            await websocket.send_text("You are not authorized to send message, just to receive alerts")

            while True:
                await websocket.receive_text()
                

    except WebSocketDisconnect:
        del connections[session_id]
        pass

if __name__ == "__main__":
    uvicorn.run(app, host="192.168.15.3", port=5001,  proxy_headers=True, forwarded_allow_ips="*")