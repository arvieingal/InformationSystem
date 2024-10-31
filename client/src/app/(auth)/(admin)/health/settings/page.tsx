'use client'
import HealthCard from '@/components/HealthCard'
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
      {/* Card 1 */}
      <HealthCard
        path="/health/nutritional_status"
        imageSrc="/img/patient_record.png"
        altText="Image 1"
        title="Nutritional Status"
        onClick={() => handleCardClick("/health/nutritional_status")} />
      {/* Card 2 */}
      <HealthCard
        path="/health/health_record"
        imageSrc="/img/health_record.png"
        altText="Image 2"
        title="Health Records"
        onClick={() => handleCardClick("/health/health_record")} />
      {/* Card 3 */}
      <HealthCard
        path="/health/reports"
        imageSrc="/img/report.png"
        altText="Image 3"
        title="Reports and Analysis"
        onClick={() => handleCardClick("/health/reports")} />
      {/* Card 4 */}
      <HealthCard
        path="/health/settings"
        imageSrc="/img/settings.png"
        altText="Image 4"
        title="Settings"
        onClick={() => handleCardClick("/health/settings")} />
    </div>
    </div>
  )
}

export default Settings
