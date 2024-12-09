'use client'
import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
interface VaccinatedCount {
  number_of_vaccinated: string;
  vaccine_type: string;

}

const ImmuniReport: React.FC = () => {
  const [vaccinatedCounts, setVaccinatedCounts] = useState<VaccinatedCount[]>([]);

  // Fetch the vaccinated count data
  useEffect(() => {
    const fetchVaccinatedCount = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vaccinated-count`);
        const data = await response.json();
        setVaccinatedCounts(data);
        
      } catch (error) {
        console.error("Error fetching vaccinated count:", error);
      }
    };

    fetchVaccinatedCount();
  }, []);


  const exportToPDF = () => {
    const input = document.getElementById("immuni-report");
    if (input) {
      html2canvas(input, {
        scale: 3,
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("immunization_report.pdf");
      }).catch((error) => {
        console.error("Error generating PDF:", error);
      });
    } else {
      console.error("Element with ID 'immuni-report' not found.");
    }
  };

  const vaccineTypes = [
    "BCG Vaccine",
    "Hepatitis B Vaccine",
    "Pentavalent Vaccine (DPT-Hep B-HIB)",
    "Oral Polio Vaccine (OPV)",
    "Inactivated Polio Vaccine (IPV)",
    "Pneumococcal Conjugate Vaccine (PCV)",
    "Measles, Mumps, Rubella Vaccine (MMR)",
    "Vitamin A",
    "Deworming",
    "Dental Check-up",
    "Others"
  ];

  return (
    <><div id="immuni-report" className="p-4 bg-gray-50 min-h-screen flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold">Republic of the Philippines</h2>
        <h3 className="font-semibold">Department of Health</h3>
        <h4 className="font-semibold">NATIONAL IMMUNIZATION COUNCIL</h4>
        <h5 className="mt-4 font-semibold">
          Immunization Report Summary
        </h5>
      </div>

      {/* General Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 w-full max-w-4xl mt-[2rem]">
        <div className="flex flex-col">
          <label>Municipality/City:</label>
          <input type="text" className="border-b border-black bg-transparent outline-none p-1" />
        </div>
        <div className="flex flex-col">
          <label>Province:</label>
          <input type="text" className="border-b border-black bg-transparent outline-none p-1" />
        </div>
        <div className="flex flex-col">
          <label>Region:</label>
          <input type="text" className="border-b border-black bg-transparent outline-none p-1" />
        </div>
        <div className="flex flex-col">
          <label>Year:</label>
          <input type="text" className="border-b border-black bg-transparent outline-none p-1" />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto mt-2 w-full max-w-4xl">
        <table className="min-w-full border-2 border-black bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border border-black text-medium">Vaccine</th>
              <th className="py-2 px-4 border border-black text-medium">Dose</th>
              <th className="py-2 px-4 border border-black text-medium">Number of Vaccinated</th>
              <th className="py-2 px-4 border border-black text-medium">Date Given (mm/dd/yy)</th>
              <th className="py-2 px-4 border border-black text-medium">Health Center</th>
              <th className="py-2 px-4 border border-black text-medium">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {vaccineTypes.map((vaccine, index) => {
              // Find the matching vaccine count from the fetched data
              const vaccineData = vaccinatedCounts.find(
                (item) => item.vaccine_type === vaccine
              );
              const vaccinatedCount = vaccineData ? vaccineData.number_of_vaccinated : 0;

              return (
                <tr key={index}>
                  <td className="py-2 px-4 border border-black">{vaccine}</td>
                  <td className="py-2 px-4 border border-black">
                    <input type="text" className="w-full border-black bg-transparent outline-none" />
                  </td>
                  <td className="py-2 px-4 border border-black text-center">{vaccinatedCount}</td>
                  <td className="py-2 px-4 border border-black">
                    <input type="text" className="w-full border-black bg-transparent outline-none" />
                  </td>
                  <td className="py-2 px-4 border border-black">
                    <input type="text" className="w-full border-black bg-transparent outline-none" />
                  </td>
                  <td className="py-2 px-4 border border-black">
                    <input type="text" className="w-full border-black bg-transparent outline-none" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 w-full max-w-4xl">
        <div className="flex flex-col">
          <label>Prepared By:</label>
          <div className="border-b border-black bg-transparent outline-none p-[1rem] w-full"></div>
          <p className="mt-2">Name & Signature of Immunization Coordinator</p>
        </div>
        <div className="flex flex-col">
          <label>Checked By:</label>
          <div className="border-b border-black bg-transparent outline-none p-[1rem] w-full"></div>
          <p className="mt-2">Name & Signature of City/Municipal Health</p>
        </div>
        <div className="flex flex-col">
          <label>Approved By:</label>
          <div className="border-b border-black bg-transparent outline-none p-[1rem] w-full"></div>
          <p className="mt-2">Name & Signature of Mayor</p>
        </div>
      </div>
    </div>
      <div className='flex justify-center items-center '>
        <button onClick={exportToPDF} className='bg-blue-500 text-white p-2 rounded-md'>EXPORT</button>
      </div>
    </>
  );
};

export default ImmuniReport;
