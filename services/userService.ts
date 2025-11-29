import { ResponseType, UserDataType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const updateUser = async (
  uid: string,
  updateData: UserDataType
): Promise<ResponseType> => {
  try {
    // Firebase
    // const userRef = doc(firestore, "users", uid)
    // await updateDoc(userRef, updateData)
    
    const res = await fetchWithAuth("http://10.0.2.2:3000/api/v1/users/" + uid, {
  method: 'PUT',
  body: JSON.stringify(updateData),
});
    
if (!res.ok) {
      const data = await res.json()
      return {success: false, msg: data.msg}}

    return { success: true };
  } catch (error: any) {
    console.log("Erro ao actualizar Usuário: ", error);
    return { success: false, msg: error?.message };
  }
};

const refreshToken = async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken')
  if (!refreshToken) return null
  const res = await fetch("http://10.0.2.2:3000/api/v1/users/refresh-token", {
    method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({refreshToken})
  })
  if (res.ok) {
    const data = await res.json()
    await AsyncStorage.setItem("token", data.token)
    return data.token
  } else {
    await AsyncStorage.multiRemove(["token", "refreshToken", "user"])
    return null
  }
}

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  let token = await AsyncStorage.getItem('token');
  
  const authHeaders = {
...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
};

  let response = await fetch(url, {...options, headers: authHeaders});

  // Se o token expirou, tenta renovar
  if (response.status === 401) {
    token = await refreshToken();
    if (!token) throw new Error('Sessão expirada');

    const retryHeaders = {
...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
};

    response = await fetch(url, {...options, headers: retryHeaders});
}

  return response;
};