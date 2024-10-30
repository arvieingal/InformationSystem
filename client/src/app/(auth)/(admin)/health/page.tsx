'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import HealthCard from '@/components/HealthCard'; 

const Health = () => {
    const router = useRouter(); 
    const handleCardClick = (path: string) => {
        router.push(path); 
    };

    return (
        <>
        {router.pathname === '/health/nutritional_status' && (
            <HealthCard 
                path="/health/nutritional_status" 
                imageSrc="/img/patient_record.png" 
                altText="Image 1" 
                title="Nutritional Status Distribution" 
                onClick={handleCardClick} 
            />
        )}
        <div className="flex flex-row md:flex md:flex-row justify-center gap-[3rem] ">
            {/* Card 1 */}
            <HealthCard 
                path="/health/nutritional_status" 
                imageSrc="/img/patient_record.png" 
                altText="Image 1" 
                title="Nutritional Status" 
                onClick={handleCardClick} 
            />
            {/* Card 2 */}
            <HealthCard 
                path="/health/health_record" 
                imageSrc="/img/health_record.png" 
                altText="Image 2" 
                title="Health Records" 
                onClick={handleCardClick} 
            />
            {/* Card 3 */}
            <HealthCard 
                path="/health/reports" 
                imageSrc="/img/report.png" 
                altText="Image 3" 
                title="Reports and Analysis" 
                onClick={handleCardClick} 
            />
            {/* Card 4 */}
            <HealthCard 
                path="/health/settings" 
                imageSrc="/img/settings.png" 
                altText="Image 4" 
                title="Settings" 
                onClick={handleCardClick} 
            />
        </div>
        <div className='flex flex-col pt-[2rem] px-[2rem]'>
            <input 
                type="text" 
                placeholder="Search..." 
                className="border border-gray-300 p-2 rounded-lg outline-none w-full" 
            />
        </div>
        <div className='flex flex-row sm:grid-cols-2 sm:grid md:grid-cols-2 md:grid pt-[2rem] px-[2rem] gap-4 justify-center'>
 {/* Card 5 */}
 <div className="border border-gray-300 bg-white p-4 w-full sm:w-[25rem] h-[27rem] rounded-lg flex flex-col gap-8">
 <p className="text-gray-700 ">Nutritional status distribution (0-5 YEARS OLD)  </p>
            <Image
                src="/svg/immunization.svg"
                alt="Image 5"
                width={600}
                height={100} />
          
        </div>
        {/* Card 6 */}
        <div className="border border-gray-300 bg-white p-4 w-full sm:w-[26rem] h-[27rem] rounded-lg flex flex-col gap-8">
            <p className="text-gray-700 mb-2">Immunization coverage per vaccine type</p>
            <Image
                src="/svg/nutritional.svg"
                alt="Image 6"
                width={800}
                height={200} />
        </div>
        {/* Card 7 */}
        <div className="border border-gray-300 bg-white p-4 w-full sm:w-[25rem] h-[27rem] rounded-lg flex flex-col gap-8">
        <p className="text-gray-700 mb-2">Monthly cases of common illnesses</p>
            <Image
                src="/svg/image_7.svg"
                alt="Image 7"
                width={120}
                height={200} />
          
        </div>
        {/* Card 8 */}
        <div className="border border-gray-300 bg-white p-4 w-full sm:w-[25rem] h-[27rem] rounded-lg flex flex-col gap-8">
        <p className="text-gray-700 mb-2">Reports and Analysis</p>
            <Image
                src="/img/new_image_4.png"
                alt="Image 8"
                width={120}
                height={200} />
           
        </div>
        </div>
        </>
    )
    }
export default Health
