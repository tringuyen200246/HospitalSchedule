"use client";
import React from "react";
import { useParams } from "next/navigation";
// Đảm bảo đường dẫn import này đúng với dự án của bạn
import DoctorDetailPage from "@/common/pages/DoctorDetailPage"; 

const GuestDoctorDetailPage = () => {
  const params = useParams();

  // Xử lý lấy ID an toàn (tránh trường hợp undefined hoặc array)
  const rawId = params?.doctorId;
  const doctorId = Array.isArray(rawId) ? rawId[0] : rawId;

  // Nếu chưa lấy được ID, hiện loading để tránh lỗi
  if (!doctorId) {
    return <div>Đang tải dữ liệu...</div>;
  }

  // Truyền ID xuống component con
  // Lúc này TypeScript sẽ không báo lỗi nữa vì file con đã có Interface
  return <DoctorDetailPage params={{ doctorId }} />;
};

export default GuestDoctorDetailPage;