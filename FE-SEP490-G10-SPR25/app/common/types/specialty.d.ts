// app/common/types/specialty.d.ts

// Thêm "export" vào trước interface
export interface ISpecialty {
  specialtyId: number;
  specialtyName: string;
  description?: string;
  image: string;
  rating?: number;
  ratingCount?: number;
}

export interface ISpecialtyDetail extends ISpecialty {
  services?: any[]; 
  doctors?: any[];  
  overview?: string;
}