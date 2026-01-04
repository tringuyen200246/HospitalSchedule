interface IDoctor extends IUser {
  academicTitle: string;
  degree: string;
  currentWork?: string;
  doctorDescription: string;
  specialtyNames: string[];
  numberOfService: number;
  numberOfExamination: number;
  rating: number;
  ratingCount: number;
}

export interface Doctor {
  id: string | number;
  name: string;
  specialtyName?: string;
  avatarUrl?: string;
  // add other fields as needed
}



