// app/common/types/specialty.d.ts
interface ISpecialty {
  specialtyId: number;
  specialtyName: string;
  description?: string;
  image: string;
  rating?: number;
  ratingCount?: number;
}

interface ISpecialtyDetail extends ISpecialty {
  services?: IService[];
  doctors?: IRelatedDoctor[];
  overview?: string;
}