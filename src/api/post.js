export const createPost = async (formData) => {
  const token = localStorage.getItem("token");

  return await api.post("/user/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};
