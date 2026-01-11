"use client";

import React, { useState, useRef } from "react";
import { Button, Image, message } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../../common/services/api"; // Import api instance đã cấu hình

interface AvatarUploaderProps {
  avatarUrl?: string; // URL này BE trả về (ví dụ: https://localhost:5220/uploads/...)
  userId: string;
  onUploaded?: () => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  avatarUrl,
  userId,
  onUploaded,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hàm xử lý hiển thị nguồn ảnh
  const getAvatarSrc = () => {
    if (preview) return preview;
    if (!avatarUrl) return undefined;

    // Nếu avatarUrl đã là đường dẫn tuyệt đối (chứa http/https), dùng trực tiếp
    if (avatarUrl.startsWith("http") || avatarUrl.startsWith("/")) {
        return `${avatarUrl}?t=${Date.now()}`;
    }

    // Fallback: Nếu BE chỉ trả về tên file (ví dụ: abc.jpg) thì mới ghép với BASE_URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5220";
    return `${baseUrl}/uploads/${avatarUrl}?t=${Date.now()}`;
  };

  const handleUpload = async () => {
    if (selectedFile && userId) {
      // Logic đổi tên file giữ nguyên
      const ext = selectedFile.name.substring(
        selectedFile.name.lastIndexOf(".")
      );
      const newFileName = `user_${userId}${ext}`;
      const renamedFile = new File([selectedFile], newFileName, {
        type: selectedFile.type,
      });

      const formData = new FormData();
      formData.append("files", renamedFile);

      try {
        // Sửa: Dùng api instance thay vì fetch hardcode
        // Đường dẫn API cần khớp với Controller của bạn (Storage/UploadFiles)
        await api.post("/api/Storage/UploadFiles", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        message.success("Cập nhật ảnh đại diện thành công!");
        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onUploaded?.(); // Gọi callback để cha load lại data
      } catch (err) {
        console.error("Upload error:", err);
        message.error("Có lỗi khi upload ảnh");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-3 border-r-2 border-gray-300 py-5 w-1/2">
      <div className="w-[100px] h-[100px] overflow-hidden rounded-lg">
        <Image
          className="object-cover w-full h-full"
          src={getAvatarSrc()}
          fallback="https://via.placeholder.com/100" // Ảnh hiển thị khi lỗi hoặc null
          alt="avatar patient"
          width={100}
          height={100}
        />
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div>
        <Button
          icon={<UploadOutlined />}
          onClick={() => fileInputRef.current?.click()}
        >
          Chọn ảnh
        </Button>
        {selectedFile && (
          <>
            <Button
              type="primary"
              onClick={handleUpload}
              style={{ marginLeft: 8 }}
            >
              Cập nhật
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleRemove}
              style={{ marginLeft: 8 }}
            >
              Hủy
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AvatarUploader;