using AppointmentSchedulingApp.Application.DTOs;
using AppointmentSchedulingApp.Application.IServices;
using AppointmentSchedulingApp.Domain.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AppointmentSchedulingApp.Application.Services
{
    public class LocalStorageService : IStorageService
    {
        private readonly ILogger<LocalStorageService> _logger;
        private readonly IWebHostEnvironment _environment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _uploadFolder = "uploads"; // Tên thư mục sẽ chứa ảnh trong wwwroot

        public LocalStorageService(
            ILogger<LocalStorageService> logger, 
            IWebHostEnvironment environment, 
            IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _environment = environment;
            _httpContextAccessor = httpContextAccessor;
        }

        // Hàm xử lý lưu file vật lý vào ổ đĩa
        public async Task<S3DTO> UploadFileAsync(S3 s3)
        {
            var response = new S3DTO();
            try
            {
                // 1. Xác định đường dẫn gốc wwwroot
                string webRootPath = _environment.WebRootPath;
                if (string.IsNullOrWhiteSpace(webRootPath))
                {
                    // Fallback nếu chưa có thư mục wwwroot
                    webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }

                // 2. Tạo đường dẫn thư mục lưu trữ (ví dụ: wwwroot/uploads)
                string uploadPath = Path.Combine(webRootPath, _uploadFolder);
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                // 3. Đường dẫn file đầy đủ
                string filePath = Path.Combine(uploadPath, s3.Name);

                // 4. Lưu file
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await s3.InputStream.CopyToAsync(fileStream);
                }

                // 5. Tạo URL để truy cập file (Ví dụ: https://localhost:7000/uploads/anh.jpg)
                var request = _httpContextAccessor.HttpContext?.Request;
                var baseUrl = request != null 
                    ? $"{request.Scheme}://{request.Host}" 
                    : ""; 
                
                var fileUrl = $"{baseUrl}/{_uploadFolder}/{s3.Name}";

                // 6. Trả về kết quả
                response.StatusCode = 200;
                response.Message = "Uploaded locally successfully";
                // Trả về URL đầy đủ để FE hiển thị được luôn
                response.FileName = fileUrl; 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Local Upload Error");
                response.StatusCode = 500;
                response.Message = ex.Message;
            }

            return response;
        }

        // Hàm chính nhận danh sách file từ Controller
        public async Task<List<S3DTO>> UploadFilesAsync(List<IFormFile> files)
        {
            var results = new List<S3DTO>();
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".pdf", ".mp4" };

            foreach (var file in files)
            {
                // Validate đuôi file
                var fileExt = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (string.IsNullOrEmpty(fileExt) || !allowedExtensions.Contains(fileExt))
                {
                    results.Add(new S3DTO
                    {
                        StatusCode = 400,
                        FileName = file.FileName,
                        Message = "Invalid file type"
                    });
                    continue;
                }
                // Tên file ảnh trong root 
              var newFileName = file.FileName;
                // chuyển về dạng steam
                await using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);
                memoryStream.Position = 0;

                var s3Obj = new S3
                {
                    BucketName = _uploadFolder,
                    InputStream = memoryStream,
                    Name = newFileName,
                    ContentType = file.ContentType
                };

                // Gọi hàm lưu file
                var result = await UploadFileAsync(s3Obj);
                results.Add(result);
            }

            return results;
        }
    }
}