"use client";
import React, { useEffect, useState } from "react";
import SpecialtyList from "../../guest/components/SpecialtyList"; // Đảm bảo đúng đường dẫn
import { specialtyService } from "../services/specialtyService";
import { ISpecialty } from "../types/specialty";

interface SpecialtiesPageProps {
  isGuest?: boolean;
  basePath?: string; 
  searchParams?: any;
}

const SpecialtiesPage = ({ 
  isGuest = false, 
  basePath = "/guest" // <--- 2. Mặc định là "/guest"
}: SpecialtiesPageProps) => {
  const [specialties, setSpecialties] = useState<ISpecialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await specialtyService.getAllSpecialties();
        setSpecialties(data);
      } catch (err) {
        setError("Không thể tải danh sách chuyên khoa");
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialties();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500"></div>
    </div>
  );

  return (
    <div 
      className="relative min-h-screen w-full bg-cover bg-center bg-fixed flex flex-col items-center justify-center z-10"
      style={{ backgroundImage: 'url("/images/background_specialties.jpeg")' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 z-20"></div>
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4">
        {/* 3. Truyền basePath xuống SpecialtyList */}
        <SpecialtyList items={specialties} basePath={basePath} /> 
      </div>
    </div>
  );
};

export default SpecialtiesPage;