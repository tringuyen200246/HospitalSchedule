"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaChevronRight } from "react-icons/fa";

interface SpecialtyListProps {
  items?: any[]; 
  basePath?: string; 
}

export default function SpecialtyList({ 
  items = [], 
  basePath = "/guest" 
}: SpecialtyListProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name_asc");

  const router = useRouter();
  const ITEMS_PER_PAGE = 8;
  const imgUrl = process.env.NEXT_PUBLIC_S3_BASE_URL;

  const filteredItems = useMemo(() => {
    let data = Array.isArray(items) ? [...items] : [];
    
    if (search) {
      data = data.filter(s => s.specialtyName?.toLowerCase().includes(search.toLowerCase()));
    }
    
    if (sortBy === "name_asc") {
      data.sort((a, b) => (a.specialtyName || "").localeCompare(b.specialtyName || ""));
    }
    
    return data;
  }, [items, search, sortBy]);

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); 
  };

  return (
    <div className="relative w-full pt-16">
      <div className="flex justify-center mb-3 relative z-40">
        <div className="relative flex items-center w-[400px] bg-white rounded-full shadow-md border border-gray-300 overflow-hidden">
          <div className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 whitespace-nowrap">
            Chuyên khoa <FaChevronRight />
          </div>
          <input
            type="text"
            placeholder="Nhập tên chuyên khoa..."
            className="w-full px-3 py-2 outline-none text-black"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="relative z-1 bg-white p-6 shadow-lg rounded-lg w-full mx-auto text-black">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/5 border-r md:pr-4">
            <h3 className="font-bold mb-4 border-b pb-2">Sắp xếp</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setSortBy("name_asc")}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${sortBy === "name_asc" ? "bg-cyan-500 text-white font-bold" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                Tên từ A - Z
              </button>
            </div>
          </div>

          <div className="w-full md:w-4/5">
            {totalItems === 0 ? (
              <div className="text-center py-10 text-gray-500">Không tìm thấy chuyên khoa nào.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {paginatedItems.map((s) => (
                  <div 
                    key={s.specialtyId}
                    className="group relative h-56 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all border"
                    // SỬA: Dùng basePath thay vì cứng "/guest"
                    onClick={() => router.push(`${basePath}/specialties/${s.specialtyId}`)}
                  >
                    <Image 
                      src={s.image ? `${imgUrl}/${s.image}` : "/images/service.png"} 
                      alt={s.specialtyName} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-4">
                      <h3 className="text-white font-bold text-lg leading-tight group-hover:text-cyan-400 transition-colors">
                        {s.specialtyName}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-full transition-all ${currentPage === i + 1 ? "bg-cyan-500 text-white scale-110" : "bg-gray-200 hover:bg-gray-300"}`}
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