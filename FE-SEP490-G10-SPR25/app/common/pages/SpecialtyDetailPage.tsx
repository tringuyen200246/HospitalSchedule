"use client";

import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { specialtyService } from "@/common/services/specialtyService"; 
import { Button } from "@/common/components/Button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

// 1. Cập nhật Type để hứng đủ dữ liệu Service từ API
type SpecialtyDetail = {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  services?: { 
    id: string; 
    name: string;
    image?: string | null;
    price?: number;
  }[];
};

interface SpecialtyDetailPageProps {
  params: {
    id: string;
  };
}

const imgUrl = process.env.NEXT_PUBLIC_S3_BASE_URL;

const SpecialtyDetailPage = ({ params }: SpecialtyDetailPageProps) => {
  const [specialty, setSpecialty] = useState<SpecialtyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const id = Number(params.id);
        
        if (!isNaN(id)) {
          // Gọi API lấy chi tiết chuyên khoa (đã bao gồm Services từ Backend)
          const data: any = await specialtyService.getSpecialtyById(id);
          
          if (data) {
            setSpecialty({
              id: data.specialtyId?.toString() || params.id,
              name: data.specialtyName || "",
              description: data.description || data.specialtyDescription, // Fallback nếu backend trả về 1 trong 2
              image: data.image,
              
              // 2. Map danh sách Services từ API
              services: data.services?.map((s: any) => ({
                id: s.serviceId?.toString(),
                name: s.serviceName,
                image: s.image,
                price: s.price
              })) || [] 
            });
          }
        }
      } catch (error) {
        console.error("Error fetching specialty:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchDetail();
    }
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
  );
  
  if (!specialty) return <div className="p-8 text-center text-gray-500">Không tìm thấy chuyên khoa</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      {/* Nút quay lại */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 pl-0 hover:bg-transparent hover:text-cyan-600 flex items-center gap-2 text-gray-600 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" /> Quay lại
      </Button>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header ảnh bìa */}
        <div className="relative w-full h-64 md:h-80 group">
          <Image
            src={specialty.image ? `${imgUrl}/${specialty.image}` : "/images/background_specialties.jpeg"}
            alt={specialty.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
            <div className="p-6 md:p-10 text-white w-full">
              <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight drop-shadow-md">{specialty.name}</h1>
              <div className="h-1 w-20 bg-cyan-500 rounded-full mt-4"></div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10">
          {/* Phần mô tả */}
          <div className="prose max-w-none text-gray-600 mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-cyan-500">ℹ️</span> Giới thiệu
            </h3>
            <p className="leading-relaxed whitespace-pre-wrap text-lg">
              {specialty.description || "Chưa có mô tả chi tiết cho chuyên khoa này."}
            </p>
          </div>
          
          {/* 3. Phần danh sách dịch vụ */}
          <div className="pt-10 border-t border-gray-100">
             <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
               <span className="text-cyan-500">🏥</span> Các dịch vụ liên quan ({specialty.services?.length || 0})
             </h3>
             
             {(!specialty.services || specialty.services.length === 0) ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500 italic">Chưa có dịch vụ nào được cập nhật cho chuyên khoa này.</p>
                </div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {specialty.services.map((service) => (
                    <Link 
                      href={`/patient/services/service-detail/${service.id}`} 
                      key={service.id}
                      className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                    >
                      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                        <Image
                          src={service.image ? `${imgUrl}/${service.image}` : "/images/service.png"}
                          alt={service.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h4 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors">
                          {service.name}
                        </h4>
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="text-sm text-gray-500 font-medium">Chi phí:</span>
                          <span className="text-cyan-600 font-bold text-lg">
                            {service.price ? service.price.toLocaleString('vi-VN') : 0} ₫
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialtyDetailPage;