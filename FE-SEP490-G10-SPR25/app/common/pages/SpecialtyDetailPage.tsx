"use client";

import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { specialtyService } from "@/common/services/specialtyService"; // Đảm bảo import service đúng

// Local type to avoid missing module error for '@/common/types/specialtyDetail'
type SpecialtyDetail = {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  services?: { id: string; name: string }[];
};

import { Button } from "@/common/components/Button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

interface SpecialtyDetailPageProps {
  params: {
    id: string;
  };
}

const imgUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5220"}/api/file`;

const SpecialtyDetailPage = ({ params }: SpecialtyDetailPageProps) => {
  const [specialty, setSpecialty] = useState<SpecialtyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // specialtyService does not expose getSpecialtyById; fetch list and find by id instead
        const list = await specialtyService.getSpecialtyList();
        const data = list.find((s: any) => s.id === params.id) || null;
        setSpecialty(data);
      } catch (error) {
        console.error("Error fetching specialty:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [params.id]);

  if (loading) return <div className="p-8 text-center">Đang tải...</div>;
  if (!specialty) return <div className="p-8 text-center">Không tìm thấy chuyên khoa</div>;

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
        <div className="relative w-full h-64 md:h-80">
          <Image
            src={specialty.image ? `${imgUrl}/${specialty.image}` : "/images/background_specialties.jpeg"}
            alt={specialty.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6 md:p-8 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{specialty.name}</h1>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="prose max-w-none text-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Mô tả</h3>
            <p className="leading-relaxed whitespace-pre-wrap">{specialty.description}</p>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-100">
             <h3 className="text-xl font-semibold text-gray-900 mb-6">Các dịch vụ liên quan</h3>
             {/* Danh sách dịch vụ nếu có */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Logic hiển thị service list ở đây nếu API trả về */}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialtyDetailPage;