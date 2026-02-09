import axiosInstance from "./url.service";

export const carBookingService = {

  // ✅ CREATE BOOKING
  createBooking: async (data: {
    carId: string;
    startDate: string;
    endDate: string;
  }) => {
    try {
      const response = await axiosInstance.post("/api/booking", data);
      return response.data;
    } catch (error: any) {
      console.error(
        "Create booking error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // ✅ PAY BOOKING
  payBooking: async (bookingId: string) => {
    try {
      const response = await axiosInstance.patch(
        `/api/booking/${bookingId}/pay`
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Pay booking error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // ✅ GET MY BOOKINGS
  getMyBookings: async () => {
    try {
      const response = await axiosInstance.get("/api/booking/my");
      return response.data;
    } catch (error: any) {
      console.error(
        "Get my bookings error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
