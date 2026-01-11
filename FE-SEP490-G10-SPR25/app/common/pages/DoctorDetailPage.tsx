"use client";
import React, { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import Image from "next/image";
// import { useParams } from "next/navigation"; // Không cần dùng cái này nữa vì đã nhận qua props
import { useRouter } from "next/navigation";
import { doctorService } from "@/common/services/doctorService";
import { Button } from "@/common/components/Button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

// 1. Interface định nghĩa Props nhận vào từ file cha
interface DoctorDetailPageProps {
  params: {
    doctorId: string;
  };
}

type DoctorDetail = {
  userId: number;           // BE: UserId
  userName: string;         // BE: UserName
  email: string;
  phone: string;            // BE: Phone
  avatarUrl?: string | null;
  gender: boolean;
  specialtyNames: string[]; // BE: trả về mảng string
  doctorDescription?: string | null; // BE: DoctorDescription
  address?: string | null;
  
  // Các trường chi tiết từ DoctorDetailDTO
  workExperience?: string | null;
  organization?: string | null;
  prize?: string | null;
  researchProject?: string | null;
  trainingProcess?: string | null;
};

// Thay đổi URL ảnh
const imgUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5220"}/api/uploads`;

// 2. SỬA DÒNG NÀY: Nhận params từ props thay vì dùng useParams()
const DoctorDetailPage = ({ params }: DoctorDetailPageProps) => {
  const { doctorId } = params; // Lấy doctorId từ props truyền xuống
  
  const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctorDetail = async () => {
      try {
        if (doctorId) {
          // Gọi API lấy chi tiết trực tiếp
          // Đảm bảo convert sang Number vì API BE cần int
          const numericId = Number(doctorId);
          if (isNaN(numericId)) return;

          const data = await doctorService.getDoctorDetailById(numericId);
          // Ép kiểu dữ liệu trả về về type cục bộ để hiển thị
          setDoctor(data as unknown as DoctorDetail);
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
              alt={doctor.userName}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.userName}</h1>
                <p className="text-blue-600 font-medium text-lg">
                    {/* Hiển thị mảng chuyên khoa */}
                    {doctor.specialtyNames?.join(", ") || "Chuyên khoa chưa cập nhật"}
                </p>
                {doctor.organization && (
                    <p className="text-gray-500 mt-1">{doctor.organization}</p>
                )}
              </div>
              <Button
                onClick={() => router.push(`/patient/appointment-booking?doctorId=${doctor.userId}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-full shadow-lg shadow-blue-200 transition-all hover:scale-105"
              >
                Đặt lịch ngay
              </Button>
            </div>
            
            <p className="text-gray-600 leading-relaxed max-w-3xl whitespace-pre-line">
              {doctor.doctorDescription || "Chưa có mô tả về bác sĩ này."}
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
                Kinh nghiệm & Thành tựu
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
                        <span className="text-gray-900 font-medium">{doctor.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 min-w-[80px]">Giới tính:</span>
                        <span className="text-gray-900 font-medium">{doctor.gender ? "Nam" : "Nữ"}</span>
                      </div>
                       {doctor.address && (
                        <div className="flex items-center gap-3">
                            <span className="text-gray-500 min-w-[80px]">Địa chỉ:</span>
                            <span className="text-gray-900 font-medium">{doctor.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="experience" className="outline-none animate-fadeIn">
                <div className="space-y-8">
                  {/* Hiển thị Quá trình đào tạo */}
                  {doctor.trainingProcess && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                        Quá trình đào tạo
                      </h3>
                      <p className="text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-100">
                          {doctor.trainingProcess}
                      </p>
                    </div>
                  )}

                  {/* Hiển thị Kinh nghiệm làm việc */}
                  {doctor.workExperience && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                        Kinh nghiệm làm việc
                      </h3>
                      <p className="text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-100">
                          {doctor.workExperience}
                      </p>
                    </div>
                  )}

                  {/* Hiển thị Giải thưởng / Nghiên cứu */}
                   {(doctor.prize || doctor.researchProject) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                        Thành tựu & Nghiên cứu
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {doctor.prize && (
                            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                <p className="font-semibold text-gray-900 mb-1">Giải thưởng</p>
                                <p className="text-gray-700 whitespace-pre-line">{doctor.prize}</p>
                            </div>
                        )}
                        {doctor.researchProject && (
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="font-semibold text-gray-900 mb-1">Dự án nghiên cứu</p>
                                <p className="text-gray-700 whitespace-pre-line">{doctor.researchProject}</p>
                            </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Thông báo nếu không có dữ liệu */}
                  {!doctor.trainingProcess && !doctor.workExperience && !doctor.prize && !doctor.researchProject && (
                      <p className="text-gray-500 italic">Chưa cập nhật thông tin chi tiết.</p>
                  )}
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