type AuthResponse = {
  status: number;
  username?: string;
  error_message?: string;
};

export const authenticateSession = async (): Promise<AuthResponse> => {
    const res = await fetch(`http://192.168.15.3:5000/api/authsession`, {
        method: "POST",
        credentials: "include"
    })

    const data = await res.json()
    return data
}

export const signupSubmit = async (email: string, password: string, username: string) => {
    const res = await fetch(`http://192.168.15.3:5000/api/signupsubmit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, username }),
    })

    const data = await res.json()
    return data
}

export const loginRequest = async (email: string, password: string) => {
    const res = await fetch(`http://192.168.15.3:5000/api/requestlogin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
    })

    const data = await res.json()
    console.log(data)
    return data
}
