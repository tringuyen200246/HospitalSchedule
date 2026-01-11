import { IDoctor } from "./doctor";

export interface IDoctorDetailDTO extends IDoctor {
    workExperience?: string;     // Khớp WorkExperience
    organization?: string;       // Khớp Organization
    prize?: string;              // Khớp Prize
    researchProject?: string;    // Khớp ResearchProject
    trainingProcess?: string;    // Khớp TrainingProcess
    schedules: any[];            // Khớp Schedules
    services: any[];             // Khớp Services
    feedbacks: any[];            // Khớp Feedbacks
    relevantDoctors: IDoctor[];  // Khớp RelevantDoctors
}