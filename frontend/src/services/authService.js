const API_BASE = "http://localhost:8888";

/**
 * @description - Login in the user, sends credentials to the backend login endpoint
 * @param {Object} credentials - contains the username and password of the user
 * @returns {Object} server responds with the token and user
 */
export async function login(credentials) {
    console.log("Login payload:", credentials);

    const response = await fetch(`${API_BASE}/users/login`, {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    })

    if(!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
    }

    return response.json();

}

/**
 * @description Register a new user, send credentials to the backend register endpoint
 * @param {string} credentials - the credentials of the user, including username and password
 * @returns {Object} server response
 */
export async function register(credentials) {
    const response = await fetch(`${API_BASE}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
    }

    return response.json();
}

/**
 * @description Remove the JWT token from local storage to effectively logout the user
 */
export function logout() {
    localStorage.removeItem("token");
}