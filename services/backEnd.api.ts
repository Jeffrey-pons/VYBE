interface ApiRequestOptions {
  method?: string;
  body?: any;
  token?: string | null;
  headers?: Record<string, string>;
  credentials?: 'same-origin' | 'include' | 'omit';
}

const BASE_URL = "https://e60e-195-7-117-146.ngrok-free.app/api/auth";

// const BASE_URL = "http://localhost:5000/api/auth"; 

export const apiRequest = async (endpoint: string, method: string = "GET", body: any = null, token: string | null = null) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options: ApiRequestOptions = {
    method,
    headers,
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, options);
    // const textResponse = await response.text();
    // console.log(textResponse);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Une erreur est survenue");
    }
    const JSONResponse = await response.json()
    return JSONResponse
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Erreur API : ${error.message}`);
    }
    throw error;
  }
};

export const registerUser = async (name: string, lastname: string, email: string, password: string) => {
  const res = await apiRequest("register", "POST", { name, lastname, email, password });
  return res;
};

export const loginUser = async (email: string, password: string) => {
  return await apiRequest("login", "POST", { email, password });
};

export const getUserInfos = async (userId: string, token: string) => {
  return await apiRequest(`infos/${userId}`, "GET", null, token);
};

export const deleteUser = async (userId: string, token: string) => {
  return await apiRequest(`delete/${userId}`, "DELETE", null, token);
};