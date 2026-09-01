from psycopg_pool import ConnectionPool

class postgres_database:
    def __init__(self):
       self.pool = ConnectionPool(
            "postgresql://postgres:2008@localhost:5432/usersinformation", 
            max_size=10
       ) 
    
    def get_user_id_by_session(self, session_id: str):
        with self.pool.connection() as conn:
            with conn.cursor() as cur: 
                cur.execute("SELECT user_id FROM users_session WHERE user_session_id = %s", (session_id,))
                
                if cur.rowcount == 0:
                    return {"status": 400, "error_message": "Invalid session"}
                
                else:
                    return cur.fetchone()

    def store_user_session(self, email: str, password: str, session_id: str):
        with self.pool.connection() as conn:
            with conn.cursor() as cur: 
                cur.execute("""
                    INSERT INTO users_session (user_id, user_session_id, user_role)
                    VALUES ((SELECT user_id FROM users_credentials WHERE user_email = TRIM(%s) AND user_password = TRIM(%s)), TRIM(%s), 'client')
                    RETURNING 200
                """, (email, password, session_id))

                if cur.fetchone() is None:
                    return {"status": 400, "error_message": "Failed to store user session"}
                
                else:                    
                    return {"status": 200}

    def insert_user(self, user_id: str, email: str, password: str, username: str):
        with self.pool.connection() as conn:
            with conn.cursor() as cur: 
                print(f"Inserting user with email: {email} and password: {password}")

                cur.execute("""
                    INSERT INTO users_credentials (user_id, user_email, user_password, user_name, user_role) 
                    VALUES (TRIM(%s), TRIM(%s), TRIM(%s), TRIM(%s), 'client')
                    ON CONFLICT (user_email) DO NOTHING
                    RETURNING user_email
                    """, 
                    (user_id, email, password, username)
                )

                validate = cur.fetchone()

                if validate:  
                    return {"status": 200}
                
                else:
                    return {"status": 400, "error_message": "User has already created "}

    def select_user(self, email: str, password: str):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT user_email, user_password, user_name FROM users_credentials WHERE user_email = %s AND user_password = %s", (email, password))

                if cur.rowcount == 0:
                    return {"status" : 400, "error_message": "User not found"}

                else:
                    database_email, database_password, username = cur.fetchone()
                    if database_email == email and database_password == password:
                        return {"status" : 200, "username": username}

    def get_user_role_by_session(self, session_id: str):
        with self.pool.connection() as conn:
            with conn.cursor() as cur: 
                cur.execute("SELECT user_role FROM users_session WHERE user_session_id = %s", (session_id,))
                
                if cur.rowcount == 0:
                    return {"status": 400, "error_message": "Invalid session"}
                
                else:
                    return {"status": 200, "user_role": cur.fetchone()[0]}