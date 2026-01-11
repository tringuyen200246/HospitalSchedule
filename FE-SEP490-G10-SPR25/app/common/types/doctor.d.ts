// app/common/types/doctor.d.ts
interface IDoctor {
  doctorId: number;
  doctorName: string;
  image: string;
  expertise?: string;
  academicTitle?: string;
  degree?: string;
  rating?: number;
  ratingCount?: number;
  specialtyId?: number;
}

interface IDoctorDetail extends IDoctor {
  specialtyName?: string;
  introduction?: string;
  trainingProcess?: string;
  achievements?: string[];
  services?: IService[];
}