import axiosInstance from "./url.service";

export const authDash = {
  getAdminDashboard: () =>
    axiosInstance.get("/api/dashboard/admin"),
};
