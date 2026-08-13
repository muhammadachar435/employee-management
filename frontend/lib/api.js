import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fixed: All function names match what's imported in the frontend
export const login = (email, password) => {
  return api.post("/auth/login", { email, password });
};

export const register = (email, password, role) => {
  return api.post("/auth/register", { email, password, role });
};

export const getEmployees = () => {
  return api.get("/employees");
};

export const getEmployee = (id) => {
  return api.get(`/employees/${id}`);
};

// Fixed: createEmployee (was createEmployer)
export const createEmployee = (data) => {
  return api.post("/employees", data);
};

// Fixed: updateEmployee (was updateEmployer)
export const updateEmployee = (id, data) => {
  return api.put(`/employees/${id}`, data);
};

//  Fixed: deleteEmployee (was deleteEmployer)
export const deleteEmployee = (id) => {
  return api.delete(`/employees/${id}`);
};

export const getDashboardStats = () => {
  return api.get("/employees/dashboard/stats");
};

export default api;
