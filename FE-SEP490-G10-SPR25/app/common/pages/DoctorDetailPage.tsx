"use client";
import React, { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { doctorService } from "@/common/services/doctorService";

type DoctorDetail = {
  id: number | string;
  name: string;
  avatarUrl?: string | null;
  specialtyName?: string | null;
  description?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  gender?: boolean | null;
  certifications?: {
    id: number | string;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
  }[];
};

import { Button } from "@/common/components/Button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

// Thay đổi URL ảnh
const imgUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5220"}/api/file`;

const DoctorDetailPage = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctorDetail = async () => {
      try {
        if (typeof doctorId === "string") {
          // Fallback: fetch the list and find the doctor by id since getDoctorById is not available
          const list = await doctorService.getDoctorList();
          const found = list.find((d: any) => String(d.id) === doctorId);
          if (found) {
            setDoctor(found as unknown as DoctorDetail);
          } else {
            setDoctor(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch doctor detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetail();
  }, [doctorId]);

  if (loading) return <div className="p-8 text-center">Đang tải thông tin bác sĩ...</div>;
  if (!doctor) return <div className="p-8 text-center">Không tìm thấy bác sĩ</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 pl-0 hover:bg-transparent hover:text-blue-600 flex items-center gap-2"
      >
        <ArrowLeftIcon className="w-4 h-4" /> Quay lại
      </Button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner">
            <Image
              src={doctor.avatarUrl ? `${imgUrl}/${doctor.avatarUrl}` : "/images/doctor.png"}
              alt={doctor.name}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                <p className="text-blue-600 font-medium text-lg">{doctor.specialtyName}</p>
              </div>
              <Button
                onClick={() => router.push(`/patient/appointment-booking?doctorId=${doctor.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-full shadow-lg shadow-blue-200 transition-all hover:scale-105"
              >
                Đặt lịch ngay
              </Button>
            </div>
            
            <p className="text-gray-600 leading-relaxed max-w-3xl">
              {doctor.description || "Chưa có mô tả về bác sĩ này."}
            </p>
          </div>
        </div>

        {/* Details Tabs */}
        <div className="border-t border-gray-100">
          <Tabs.Root defaultValue="info" className="w-full">
            <Tabs.List className="flex border-b border-gray-200 px-6 md:px-8 bg-gray-50/50">
              <Tabs.Trigger
                value="info"
                className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-all outline-none"
              >
                Thông tin chung
              </Tabs.Trigger>
              <Tabs.Trigger
                value="experience"
                className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-all outline-none"
              >
                Kinh nghiệm & Học vấn
              </Tabs.Trigger>
            </Tabs.List>

            <div className="p-6 md:p-8">
              <Tabs.Content value="info" className="outline-none animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Liên hệ</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 min-w-[80px]">Email:</span>
                        <span className="text-gray-900 font-medium">{doctor.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 min-w-[80px]">SĐT:</span>
                        <span className="text-gray-900 font-medium">{doctor.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 min-w-[80px]">Giới tính:</span>
                        <span className="text-gray-900 font-medium">{doctor.gender ? "Nam" : "Nữ"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="experience" className="outline-none animate-fadeIn">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                      Chứng chỉ & Bằng cấp
                    </h3>
                    {doctor.certifications && doctor.certifications.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {doctor.certifications.map((cert) => (
                          <div key={cert.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="font-semibold text-gray-900">{cert.name}</p>
                            <p className="text-sm text-gray-500 mt-1">{cert.description}</p>
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                                <a 
                                    href={`${imgUrl}/${cert.imageUrl}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Xem chứng chỉ
                                </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">Chưa cập nhật thông tin.</p>
                    )}
                  </div>
                </div>
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;