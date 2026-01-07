
import api from "./axios";

export const updateProfile = async (formData) => {
  const res = await api.put("/user/edit-profile", formData);
  return res.data;
};



