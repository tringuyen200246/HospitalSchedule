"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Specialty } from "@/common/types/specialty";
import styles from "../../SpecialtyList.module.css";

interface SpecialtyListProps {
  specialties: Specialty[];
}

// Thay đổi URL ảnh: Trỏ về API Backend thay vì S3
const imgUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5220"}/api/file`;

const SpecialtyList: React.FC<SpecialtyListProps> = ({ specialties }) => {
  return (
    <div className={styles.grid}>
      {specialties.map((specialty) => (
        <Link
          href={`/guest/specialties/${specialty.id}`}
          key={specialty.id}
          className={styles.card}
        >
          <div className={styles.imageWrapper}>
            <Image
              src={specialty.image ? `${imgUrl}/${specialty.image}` : "/images/service.png"}
              alt={specialty.name}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className={styles.content}>
            <h3 className={styles.name}>{specialty.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SpecialtyList;