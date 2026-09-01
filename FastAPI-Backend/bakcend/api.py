from fastapi import FastAPI, Request, Response
from psycopg_pool import ConnectionPool
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

import uvicorn
import secrets

//test

class postgres_database:
    def __init__(self):
       self.pool = ConnectionPool(
            "postgresql://postgres:2008@localhost:5432/postgres", 
            max_size=10
       ) 

    def store_user_session(self, email: str, password: str, session_id: str):
        with self.pool.connection() as conn:
            with conn.cursor() as cur: 
                cur.execute("""
                    INSERT INTO users_session (user_id, user_session_id)
                    VALUES ((SELECT user_id FROM users_credentials WHERE user_email = TRIM(%s) AND user_password = TRIM(%s)), TRIM(%s))
                    RETURNING 200
                """, (email, password, session_id))

                validate = cur.fetchone()

                if validate:
                    return {"status": 200}
                else:                    
                    return {"status": 400, "error_message": "Failed to store user session"}

    def insert_user(self, email: str, password: str, user_id: str):
        with self.pool.connection() as conn:
            with conn.cursor() as cur: 
                print(f"Inserting user with email: {email} and password: {password}")
                cur.execute("""
                    INSERT INTO users_credentials (user_email, user_password, user_id) 
                    VALUES (TRIM(%s), TRIM(%s), TRIM(%s))
                    ON CONFLICT (user_email) DO NOTHING
                    RETURNING user_email
                    """, 
                    (email, password, user_id)
                )

                validate = cur.fetchone()

                if validate:  
                    return {"status": 200}
                else:
                    return {"status": 400, "error_message": "User has already created "}

    def select_user(self, email: str, password: str):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM users_credentials WHERE user_email = %s AND user_password = %s", (email, password))
                if cur.rowcount == 0:
                    return {"status" : 400, "error_message": "User not found"}
                else:
                    database_email, database_password = cur.fetchone()
                    if database_email == email and database_password == password:
                        return {"status" : 200}

class LoginRequest(BaseModel):
    email: str
    password: str

class FastAPiEndpoints:
    def __init__(self):
        self.database = postgres_database()
        self.app = FastAPI()
        
        self.origins = [
            "http://localhost:3000",
            "http://192.168.15.3:3000",
            "http://127.0.0.1:3000"
        ]

        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=self.origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        self.app.add_api_route("/api/signupsubmit", self.signup_fetch, methods=["POST"])
        self.app.add_api_route("/api/requestlogin", self.login_fetch, methods=["POST"])

    async def signup_fetch(self, email: str, password: str):
        user_id = secrets.token_urlsafe(48)[:64]
        result = self.database.insert_user(email, password, user_id)
        
        return result

    async def login_fetch(self, login_request: LoginRequest, response: Response, request: Request):
        email = login_request.email
        password = login_request.password

        pending_user = self.database.select_user(email, password)

        request_session = request.cookies.get("session_id")

        if pending_user["status"] == 200 and not request_session: 
            session_id = secrets.token_urlsafe(38)[:48]

            session_pending = self.database.store_user_session(email, password, session_id)

            if session_pending["status"] == 200:
                response.set_cookie(key="session_id", value=session_id, httponly=True, secure=False, samesite="None")
                return session_pending
        else:
            return pending_user

if __name__ == "__main__":
    uvicorn.run(FastAPiEndpoints().app, host="192.168.15.3", port=5001)