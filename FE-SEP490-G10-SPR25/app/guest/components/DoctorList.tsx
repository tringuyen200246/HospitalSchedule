"use client";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaChevronRight } from "react-icons/fa";
import RatingStars from "../../common/components/RatingStars";
import { specialtyService } from "../../common/services/specialtyService";

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
  basePath?: string; // <--- THÊM PROP NÀY (Mặc định là "/guest")
}

export default function DoctorList({ 
  items = [], 
  showLoginButton = false, 
  basePath = "/guest" // <--- Giá trị mặc định
}: DoctorListProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null);
  const [specialties, setSpecialties] = useState<{ id: number; name: string }[]>([]);
  const [sortBy, setSortBy] = useState("rating");

  const router = useRouter();
  const ITEMS_PER_PAGE = 6;
  const imgUrl = process.env.NEXT_PUBLIC_S3_BASE_URL || `${process.env.NEXT_PUBLIC_API_URL}/api/uploads`;

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await specialtyService.getAllSpecialties();
        setSpecialties(data.map((s: any) => ({ id: s.specialtyId || s.id, name: s.specialtyName || s.name })));
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };
    fetchSpecialties();
  }, []);

  const filteredDoctors = useMemo(() => {
    let data = Array.isArray(items) ? [...items] : [];
    if (search) {
      data = data.filter(d => d.userName?.toLowerCase().includes(search.toLowerCase()));
    }
    if (selectedSpecialty) {
      data = data.filter(d => d.specialtyId === selectedSpecialty);
    }
    if (sortBy === "rating") {
      data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "name_asc") {
      data.sort((a, b) => (a.userName || "").localeCompare(b.userName || ""));
    }
    return data;
  }, [items, search, selectedSpecialty, sortBy]);

  const totalItems = filteredDoctors.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="relative w-full pt-16">
      {/* Search Bar */}
      <div className="flex justify-center mb-3 relative z-40">
        <div className="relative flex items-center w-[400px] bg-white rounded-full shadow-md border border-gray-300 overflow-hidden">
          <div className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 whitespace-nowrap">
            Tìm kiếm <FaChevronRight />
          </div>
          <input
            type="text"
            placeholder="Tìm tên bác sĩ..."
            className="w-full px-3 py-2 outline-none text-black"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      <div className="relative z-1 bg-white p-6 shadow-lg rounded-lg w-full mx-auto flex flex-col text-black">
        <h2 className="text-center text-xl font-semibold mb-4">Đội ngũ Bác sĩ</h2>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 bg-white p-4 rounded-xl shadow-md text-sm border-r mb-4 md:mb-0">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2 border-b pb-1">Sắp xếp</h3>
                <button 
                  onClick={() => setSortBy("rating")}
                  className={`w-full text-left px-3 py-2 rounded-xl mb-1 ${sortBy === "rating" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                >
                  Đánh giá cao nhất
                </button>
                <button 
                  onClick={() => setSortBy("name_asc")}
                  className={`w-full text-left px-3 py-2 rounded-xl ${sortBy === "name_asc" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                >
                  Tên (A-Z)
                </button>
              </div>

              <div>
                <h3 className="font-bold mb-2 border-b pb-1">Chuyên khoa</h3>
                <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                  <button 
                    onClick={() => { setSelectedSpecialty(null); setCurrentPage(1); }}
                    className={`w-full text-left px-3 py-2 rounded-lg ${selectedSpecialty === null ? "bg-blue-100 text-blue-600 font-bold" : "hover:bg-gray-100"}`}
                  >
                    Tất cả chuyên khoa
                  </button>
                  {specialties.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => { setSelectedSpecialty(s.id); setCurrentPage(1); }}
                      className={`w-full text-left px-3 py-2 rounded-lg ${selectedSpecialty === s.id ? "bg-blue-100 text-blue-600 font-bold" : "hover:bg-gray-100"}`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="w-full md:w-3/4 md:pl-6">
            {totalItems === 0 ? (
              <div className="text-center py-10 text-gray-500">Không tìm thấy bác sĩ nào.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedDoctors.map((doctor) => (
                  <div 
                    key={doctor.userId}
                    className="bg-white shadow-md rounded-2xl p-4 cursor-pointer hover:shadow-xl transition-all border group"
   
                    onClick={() => router.push(`${basePath}/doctors/${doctor.userId}`)}
                  >
                    <div className="relative h-48 w-full mb-3 overflow-hidden rounded-xl bg-gray-100">
                      <Image 
                        src={doctor.avatarUrl ? `${imgUrl}/${doctor.avatarUrl}` : "/images/doctor.png"} 
                        alt={doctor.userName || "Bác sĩ"} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                        {doctor.userName}
                    </h3>

                    <p className="text-blue-600 text-sm font-semibold mb-2 line-clamp-1">
                        {doctor.specialtyNames?.join(", ") || "Chuyên khoa khác"}
                    </p>

                    <div className="flex items-center text-yellow-400">
                      <RatingStars rating={doctor.rating || 0} />
                      <span className="text-xs text-gray-500 ml-2">({doctor.ratingCount || 0} đánh giá)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-full transition-colors ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}