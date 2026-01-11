"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaChevronRight } from "react-icons/fa";
import RatingStars from "../../common/components/RatingStars";
import { specialtyService } from "../../common/services/specialtyService";

// Interface cho Doctor
interface IDoctor {
  userId: number;
  userName: string;
  avatarUrl?: string | null;
  specialtyNames?: string[];
  specialtyId?: number;
  rating?: number;
  ratingCount?: number;
}

interface DoctorListProps {
  items?: IDoctor[];
  showLoginButton?: boolean;
}

export default function DoctorList({ items = [], showLoginButton = false }: DoctorListProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null);
  const [specialties, setSpecialties] = useState<{ id: number; name: string }[]>([]);

  const router = useRouter();
  const ITEMS_PER_PAGE = 6;
  const imgUrl = process.env.NEXT_PUBLIC_S3_BASE_URL || `${process.env.NEXT_PUBLIC_API_URL}/api/uploads`;

  // Lấy danh sách chuyên khoa
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await specialtyService.getAllSpecialties();
        setSpecialties(data.map((s: any) => ({ 
          id: s.specialtyId || s.id, 
          name: s.specialtyName || s.name 
        })));
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };
    fetchSpecialties();
  }, []);

  // Filter Data (Chỉ còn lọc theo Tên và Chuyên khoa)
  const filteredDoctors = useMemo(() => {
    let data = Array.isArray(items) ? [...items] : [];

    // 1. Tìm kiếm
    if (search) {
      data = data.filter(d => d.userName?.toLowerCase().includes(search.toLowerCase()));
    }

    // 2. Lọc chuyên khoa
    if (selectedSpecialty) {
      data = data.filter(d => d.specialtyId === selectedSpecialty);
    }

    return data;
  }, [items, search, selectedSpecialty]);

  // Pagination
  const totalItems = filteredDoctors.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="relative w-full pt-8 pb-16">
      <div className="container mx-auto px-4">
        
        {/* --- Search Bar --- */}
        <div className="flex justify-center mb-8 relative z-40">
          <div className="relative flex items-center w-full max-w-lg bg-white rounded-full shadow-md border border-gray-200 overflow-hidden group focus-within:ring-2 focus-within:ring-blue-300 transition-all">
            <div className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 font-medium whitespace-nowrap">
              Tìm kiếm <FaChevronRight className="text-sm" />
            </div>
            <input
              type="text"
              placeholder="Nhập tên bác sĩ..."
              className="w-full px-4 py-3 outline-none text-gray-700 placeholder-gray-400"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 min-h-[600px]">
          
          {/* --- Title Bar --- */}
          <div className="flex flex-col md:flex-row justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
             <h2 className="text-2xl font-bold text-gray-800">
               Đội ngũ Bác sĩ <span className="text-gray-500 text-base font-normal">({totalItems})</span>
             </h2>
          </div>

          <div className="flex flex-col md:flex-row min-h-[500px]">
            
            {/* --- Sidebar (Chỉ còn danh sách Chuyên khoa - Đã xóa phần Sắp xếp) --- */}
            <div className="w-full md:w-1/4 p-6 border-r border-gray-100 bg-white">
                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                  <span className="w-1 h-6 bg-blue-500 rounded-full mr-2"></span>
                  Chuyên khoa
                </h3>
                
                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  <button 
                    onClick={() => { setSelectedSpecialty(null); setCurrentPage(1); }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                      selectedSpecialty === null 
                        ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    Tất cả chuyên khoa
                  </button>
                  {specialties.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => { setSelectedSpecialty(s.id); setCurrentPage(1); }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                        selectedSpecialty === s.id 
                          ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
            </div>

            {/* --- Grid Doctors --- */}
            <div className="w-full md:w-3/4 p-6 bg-gray-50/30">
              {totalItems === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                   <div className="text-6xl mb-4">🔍</div>
                   <p>Không tìm thấy bác sĩ nào phù hợp.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedDoctors.map((doctor) => (
                      <div 
                        key={doctor.userId}
                        onClick={() => router.push(`/guest/doctors/${doctor.userId}`)}
                        className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 cursor-pointer flex flex-col h-full"
                      >
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-gray-100">
                          <Image 
                            src={doctor.avatarUrl ? `${imgUrl}/${doctor.avatarUrl}` : "/images/doctor.png"} 
                            alt={doctor.userName || "Bác sĩ"} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          {/* Rating Badge */}
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm flex items-center gap-1 text-xs font-bold text-gray-800">
                             <span className="text-yellow-400">★</span> {doctor.rating?.toFixed(1) || 0}
                          </div>
                        </div>
                        
                        <div className="flex flex-col flex-grow">
                          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                             {doctor.specialtyNames?.[0] || "Đa khoa"}
                             {doctor.specialtyNames && doctor.specialtyNames.length > 1 && ` +${doctor.specialtyNames.length - 1}`}
                          </p>
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-1 mb-2">
                              {doctor.userName}
                          </h3>
                          
                          <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center text-sm text-gray-500">
                             <span>{doctor.ratingCount || 0} đánh giá</span>
                             <span className="group-hover:translate-x-1 transition-transform text-blue-500">Chi tiết →</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-10 gap-2">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button 
                          key={i} 
                          onClick={() => { setCurrentPage(i + 1); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                            currentPage === i + 1 
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110" 
                              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}