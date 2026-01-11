// app/common/services/doctorService.ts
import axios from "axios";
import { IDoctor } from "../types/doctor";
import { IDoctorDetailDTO } from "../types/doctorDetail";
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

  getDoctorDetailById: async (id: number): Promise<IDoctorDetailDTO> => {
    // SỬA: URL endpoint là api/Doctors/{id}, không phải api/Doctors/details/{id}
    const response = await axios.get(`${apiUrl}/${id}`);
    return response.data;
  },
  getDoctorListByServiceId: async (serviceId: number): Promise<IDoctor[]> => {
    try {
      const response = await axios.get(`${apiUrl}/GetDoctorListByServiceId/${serviceId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching doctors by service ID:", error);
      return [];
    }
  }
};