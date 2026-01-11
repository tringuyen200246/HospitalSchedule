"use client";
import React, { useState } from "react";
import Image from "next/image";
import { assets } from "@/public/images/assets";
import { useRouter, useSearchParams } from "next/navigation";

export interface SortOption {
  label: string;
  value: string;
}

export interface SelectSortProps {
  options: SortOption[]; // Đổi tên ISortOption thành SortOption cho chuẩn
  
  // Các prop cũ (cho Routing) - để Optional (?)
  path?: string;
  initialSelectedValue?: string;

  // Các prop mới (cho Controlled Component - DoctorList) - để Optional (?)
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const SelectSort: React.FC<SelectSortProps> = ({
  options,
  path,
  initialSelectedValue = "",
  value,      // Giá trị từ parent (Controlled)
  onChange,   // Hàm xử lý từ parent (Controlled)
  placeholder = "Sắp xếp"
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State nội bộ chỉ dùng khi không có prop 'value' truyền vào
  const [internalSortBy, setInternalSortBy] = useState<string>(
    searchParams.get("sortBy") || initialSelectedValue
  );
  
  const [isOpen, setIsOpen] = useState(false);

  // Xác định giá trị hiện tại: Ưu tiên prop 'value' (Controlled) -> rồi đến URL/State (Uncontrolled)
  const currentSortBy = value !== undefined ? value : internalSortBy;

  const handleSelect = (val: string) => {
    if (onChange) {
      // Cách 1: Chế độ Controlled (Dùng cho DoctorList - xử lý tại trang mẹ)
      onChange(val);
    } else if (path) {
      // Cách 2: Chế độ Routing (Dùng cho ServiceList - đẩy lên URL)
      const newSearchParams = new URLSearchParams(window.location.search);
      newSearchParams.set("sortBy", val);
      setInternalSortBy(val);
      router.push(`${path}?${newSearchParams.toString()}`);
    }
    setIsOpen(false);
  };

  // Tìm label của option đang chọn
  const selectedOption = options.find((opt) => opt.value === currentSortBy);

  return (
    <div className="relative z-50"> {/* Thêm z-50 để dropdown đè lên các phần tử khác */}
      <div className="flex items-center gap-x-3 justify-end">
        {/* Chỉ hiện label ảnh nếu cần thiết kế cũ */}
        <label className="font-medium text-gray-700 flex items-center gap-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <Image src={assets.sort || "/images/sort.png"} width={20} height={20} alt="Sort" />
          <span className="hidden sm:inline">Sắp xếp</span>
        </label>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex flex-row items-center justify-between border border-gray-300 hover:border-blue-500 text-gray-700 bg-white w-[200px] rounded-lg px-3 py-2 text-left focus:outline-none transition-all shadow-sm"
        >
          <span className="truncate">
             {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.292 7.293a1 1 0 011.415 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          {/* Overlay tàng hình để click ra ngoài tắt dropdown */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          
          <ul className="absolute right-0 mt-2 border border-gray-100 rounded-xl bg-white shadow-xl z-20 w-[220px] overflow-hidden py-1 animate-fadeIn">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`px-4 py-3 cursor-pointer text-sm transition-colors flex items-center justify-between ${
                  currentSortBy === option.value 
                    ? "bg-blue-50 text-blue-600 font-medium" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {option.label}
                {currentSortBy === option.value && (
                   <span className="text-blue-500">✓</span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default SelectSort;