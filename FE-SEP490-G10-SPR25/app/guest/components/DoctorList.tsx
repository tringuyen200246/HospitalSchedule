"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Doctor } from "@/common/types/doctor";

interface DoctorListProps {
  doctors: Doctor[];
}

// Thay đổi URL ảnh: Trỏ về API Backend thay vì S3
const imgUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5220"}/api/file`;

const DoctorList: React.FC<DoctorListProps> = ({ doctors }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {doctors.map((doctor) => (
        <div
          key={doctor.id}
          className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
          <div className="relative w-full h-48 sm:h-56">
            <Image
              src={doctor.avatarUrl ? `${imgUrl}/${doctor.avatarUrl}` : "/images/doctor.png"}
              alt={doctor.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {doctor.name}
            </h3>
            <p className="text-sm text-blue-600 font-medium mb-3">
              {doctor.specialtyName}
            </p>
            <Link
              href={`/guest/doctors/${doctor.id}`}
              className="inline-block px-6 py-2 border border-gray-300 text-gray-700 font-medium text-sm rounded-full hover:bg-gray-50 transition-colors duration-200"
            >
              Xem thêm
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorList;