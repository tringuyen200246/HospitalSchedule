using AppointmentSchedulingApp.Application.DTOs;
using AppointmentSchedulingApp.Domain.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppointmentSchedulingApp.Application.Profiles
{
    public class SpecialtyProfile  :Profile
    {
        public SpecialtyProfile()
        {
           // Mapping cho lớp cha (DTO cơ bản)
            CreateMap<Specialty, SpecialtyDTO>()
                .ForMember(dest => dest.SpecialtyId, opt => opt.MapFrom(src => src.SpecialtyId))
                .ForMember(dest => dest.SpecialtyName, opt => opt.MapFrom(src => src.SpecialtyName))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.SpecialtyDescription)) // Đã map Description ở đây
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Image))
                .ReverseMap();

            // Mapping cho lớp con (Detail DTO)
            CreateMap<Specialty, SpecialtyDetailDTO>()
                .IncludeBase<Specialty, SpecialtyDTO>() // <--- QUAN TRỌNG: Thêm dòng này để kế thừa map của Description
                .ForMember(dest => dest.SpecialtyDescription, opt => opt.MapFrom(src => src.SpecialtyDescription))
                .ReverseMap();
        }
    }
}
