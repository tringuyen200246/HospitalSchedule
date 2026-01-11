// app/common/services/doctorService.ts
import axios from "axios";

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/Doctors`;

export const doctorService = {
  getNumberOfDoctors: async (): Promise<number> => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/odata/Doctors/$count`;
      const response = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
      return response.ok ? response.json() : 0;
    } catch { return 0; }
  },

  getAllDoctors: async (): Promise<IDoctor[]> => {
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      return response.ok ? await response.json() : [];
    } catch { return []; }
  },

  getDoctorById: async (id: number): Promise<IDoctor> => {
    const response = await axios.get(`${apiUrl}/${id}`);
    return response.data;
  },

  getDoctorDetailById: async (id: number): Promise<IDoctorDetail> => {
    const response = await axios.get(`${apiUrl}/details/${id}`);
    return response.data;
  }
};