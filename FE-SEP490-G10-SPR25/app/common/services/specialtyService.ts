// app/common/services/specialtyService.ts
import axios from "axios";
import { ISpecialty, ISpecialtyDetail } from "../types/specialty";

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/Specialties`;

export const specialtyService = {
  // Lấy số lượng chuyên khoa (Sử dụng OData)
  getNumberOfSpecialties: async (): Promise<number> => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/odata/Specialties/$count`;
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      return response.ok ? response.json() : 0;
    } catch (error) {
      console.error("Error fetching specialties count:", error);
      return 0;
    }
  },

  // Lấy danh sách chuyên khoa (Sửa tên từ getSpecialtyList -> getAllSpecialties)
  getAllSpecialties: async (): Promise<ISpecialty[]> => {
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching specialties:", error);
      return [];
    }
  },

  getSpecialtyById: async (id: number): Promise<ISpecialty> => {
    const response = await axios.get(`${apiUrl}/${id}`);
    return response.data;
  },

  getSpecialtyDetailById: async (id: number): Promise<ISpecialtyDetail> => {
    const response = await axios.get(`${apiUrl}/details/${id}`);
    return response.data;
  }
};