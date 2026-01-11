// --- FILE: app/common/types/doctor.ts ---
export interface IDoctor {
  // Các trường khớp với Backend .NET
  userId: number;           // Thay cho doctorId
  userName: string;         // Thay cho doctorName
  email?: string;
  phone?: string;
  avatarUrl?: string | null; // Thay cho image
  specialtyNames?: string[]; // Backend trả về mảng tên chuyên khoa
  
  // Các trường hỗ trợ hiển thị/logic khác
  specialtyId?: number;      // Dùng để lọc (nếu có)
  rating?: number;
  ratingCount?: number;
  
  // Các trường chi tiết (Optional)
  gender?: boolean;
  address?: string;
  doctorDescription?: string;
}