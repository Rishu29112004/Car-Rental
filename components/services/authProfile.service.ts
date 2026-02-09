import axiosInstance from "./url.service";
import { UpdateUserPictureSchema } from "../custom/userProfile/component/validation/update-userProfile.schema";

export const profileServices = {
  // ✅ UPDATE PROFILE
  updateProfile: async (id: string, formData: FormData) => {
    try {
      const response = await axiosInstance.put(
        `/api/profile/update/${id}`,
        formData,
        // ❌ Do NOT set Content-Type manually — axios will detect FormData automatically
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Update profile Services errors:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // ✅ GET PROFILE
  getProfile: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/api/profile/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error(
        "Get profile error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};
