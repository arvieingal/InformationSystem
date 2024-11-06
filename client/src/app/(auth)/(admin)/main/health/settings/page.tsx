'use client'
import HealthCard from '@/components/HealthCard'
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'

const Settings: React.FC = () => {
    const router = useRouter();

    function handleCardClick(path: string) {
        router.push(path);
    }

  return (
    <div>
      <div className="flex flex-row md:flex md:flex-row justify-center gap-[4rem] ">
        <div onClick={() => router.push("/main/health/nutritional_status")}>
      <Image
        className="mt-[2rem]"
          src="/svg/immunization_records.svg"
          alt="Nutritional Status"
          width={250}
          height={50}
        />
        </div>
        <div onClick={() => router.push("/main/health/immunization_record")}>
        <Image
          src="/svg/health_image.svg"
          alt="Nutritional Status"
          width={250}
          height={50}
        />
        </div>
    </div>
    </div>
  )
}

export default Settings
