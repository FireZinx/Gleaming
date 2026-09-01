from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from database_ import postgres_database

import uvicorn
import secrets
    
app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://192.168.15.3:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database = postgres_database()

@app.post("/api/authsession")
async def auth_session(request: Request):
    session_id = request.cookies.get("session_id")

    if session_id:
        result = database.get_user_id_by_session(session_id)

        if result["status"] == 200:
            user_id = result["user_id"]
            username_result = database.get_username_by_user_id(user_id)

            if username_result["status"] == 200:
                return {"status": 200, "username": username_result["username"]}
                
            else:
                return {"status": 400, "error_message": "Failed to retrieve username"}
    else:
        return {"status": 400, "error_message": "No session found"}

class SignupRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

@app.post("/api/signupsubmit")
async def signup_fetch(signup_request: SignupRequest):
    email = signup_request.email
    password = signup_request.password
    username = signup_request.username

    if not (email and password):
        return {"status": 400, "error_message": "Email and password are required"}

    elif len(password) < 8:
        return {"status": 400, "error_message": "Password must be at least 8 characters long"} 

    else:
        user_id = secrets.token_urlsafe(48)[:64]
        result = database.insert_user(user_id=user_id, email=email, password=password, username=username)

        return result

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@app.post("/api/requestlogin")
async def login_fetch(login_request: LoginRequest, response: Response, request: Request):
    email = login_request.email
    password = login_request.password
    user_ip = request.client.host

    print(user_ip)

    request_session = request.cookies.get("session_id")

    if not request_session:
        pending_user = database.select_user(email, password)

        if pending_user["status"] == 200: 
            session_id = secrets.token_urlsafe(38)[:48]

            session_pending = database.store_user_session(email, password, session_id)

            if session_pending["status"] == 200:
                response.set_cookie(key="session_id", value=session_id, httponly=True, secure=False, samesite="lax")
                
            return {"status": 200, "username": pending_user["username"]}
        else:
            return pending_user
    else:
        return {"status": 400, "error_message": "User is already logged in"}

if __name__ == "__main__":
    uvicorn.run(app, host="192.168.15.3", port=5000,  proxy_headers=True, forwarded_allow_ips="*")