"use client";
import React, { useEffect, useState } from "react";
import DoctorList from "../../guest/components/DoctorList"; // Đảm bảo đúng đường dẫn
import { doctorService } from "../services/doctorService";
import { IDoctor } from "../types/doctor";
interface DoctorsPageProps {
  isGuest?: boolean;
}

const DoctorsPage = ({ isGuest = false }: DoctorsPageProps) => {
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getAllDoctors();
        setDoctors(data);
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-b-2 border-blue-500 rounded-full"></div>
    </div>
  );

  return (
    <div 
      className="relative min-h-screen w-full bg-cover bg-center bg-fixed flex flex-col items-center justify-center z-10"
      style={{ backgroundImage: 'url("/images/background_doctors.jpeg")' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 z-20"></div>
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4">
  
        <DoctorList items={doctors} showLoginButton={isGuest} />
      </div>
    </div>
  );
};

export default DoctorsPage;