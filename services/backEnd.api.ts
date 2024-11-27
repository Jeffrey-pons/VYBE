const BASE_URL = "http://localhost:5000/api/auth"; 

// Fonction générique pour envoyer des requêtes
export const apiRequest = async (endpoint, method = "GET", body = null, token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, options);
    console.log('response', response
    )
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Une erreur est survenue");
    }
    const JSONResponse = await response.json()
    console.log(JSONResponse,'JSON')
    return JSONResponse
  } catch (error) {
    console.error(`Erreur API : ${error.message}`);
    throw error;
  }
};

export const registerUser = async (name, lastname, email, password) => {
    const res =  await apiRequest("register", "POST", { name, lastname, email, password });
    return res
};
  
export const loginUser = async (email, password) => {
    return await apiRequest("login", "POST", { email, password });
};

export const getUserInfos = async (userId, token) => {
  return await apiRequest(`infos/${userId}`, "GET", null, token);
};

export const deleteUser = async (userId, token) => {
  return await apiRequest(`delete/${userId}`, "DELETE", null, token)
}