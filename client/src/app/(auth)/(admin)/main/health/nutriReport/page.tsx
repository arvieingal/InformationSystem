  "use client"
  import React, { useEffect, useState } from "react";
  import { jsPDF } from "jspdf";
  import html2canvas from "html2canvas";

  
  interface ChildData {
    age_group: string;
    nutritional_status: string;
    sex: string;
  }

  export default function ReportForm() {
    const [categorizedData, setCategorizedData] = useState<ChildData[]>([]);

    useEffect(() => {
      const fetchCategorizedData = async () => {
        try {
          const response = await fetch("http://localhost:3001/api/children/count/categorized");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (Array.isArray(data)) {
            setCategorizedData(data);
          } else {
            console.error("Fetched data is not an array:", data);
          }
        } catch (error) {
          console.error("Error fetching categorized data:", error);
        }
      };
    
      fetchCategorizedData();
    }, []);
    console.log(categorizedData, 'categorizedData')

    const calculateTotals = (ageGroup: string, status: string, gender: string) => {
      return categorizedData.filter(
        (child) => child.age_group === ageGroup && child.nutritional_status === status && child.sex === gender
      ).length;
    };

    const exportToPDF = () => {
      const input = document.getElementById("report-form");
      if (input) {
        html2canvas(input, {
          scale: 1,
          useCORS: true,
        }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
          });

          const imgWidth = 297;
          const imgHeight = 210;

          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const ratio = Math.min(imgWidth / canvasWidth, imgHeight / canvasHeight);

          const finalWidth = canvasWidth * ratio;
          const finalHeight = canvasHeight * ratio;

          pdf.addImage(imgData, "PNG", 0, 0, finalWidth, finalHeight);
          pdf.save("report.pdf");
        }).catch((error) => {
          console.error("Error generating PDF:", error);
        });
      } else {
        console.error("Element with ID 'report-form' not found.");
      }
    };

    return (
    <div className="p-4 bg-gray-50 min-h-screen overflow-auto">
      <div id="report-form" className="p-4 bg-gray-50 min-h-screen items-center justify-center">
        {/* Header Section */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold">Republic of the Philippines</h2>
          <h3 className="font-semibold">Department of Health</h3>
          <h4 className="font-semibold">NATIONAL NUTRITION COUNCIL</h4>
          <h5 className="mt-4 font-semibold">
            OPT Plus Form 2A: Municipality/City Report on Operation Timbang Plus
          </h5>
        </div>

        {/* General Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 px-[8rem] ">
          <div className="flex flex-col"> 
            <label>Municipality/City:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-1" />
          </div>
          <div className="flex flex-col">
            <label>Total Population:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-1" />
          </div>
          <div className="flex flex-col">
            <label>Estimated No. of PS:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-1" />
          </div>
          <div className="flex flex-col">
            <label>0 - 59 months old:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-1" />
          </div>
          <div className="flex flex-col">
            <label>Province:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-1" />
          </div>
          <div className="flex flex-col">
            <label>Year OPT Plus:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-1" />
          </div>
          <div className="flex flex-col">
            <label>Actual No. of PS measured :</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-1" />
          </div>
          <div className="flex flex-col">
            <label>0 - 71 months old:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-1" />
          </div>
          <div className="flex flex-col">
            <label>Region:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-1" />
          </div>
          <div className="flex flex-col">
            <label>Prevalence Rate UW + SUW:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-1" />
          </div>
          <div className="flex flex-col">
            <label>Percent OPT Plus Coverage:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-1" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-[8rem]">
          <div className="flex flex-col">
            <label>Total # of Barangays:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-1" />
          </div>
          <div className="flex flex-col">
            <label>0 - 59 months:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-1" />
          </div>
          <div className="flex flex-col">
            <label>No. of Indigenous PS measured:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-1" />
          </div>
          <div className="flex flex-col">
            <label>Total # of Brgy with OPT Plus Results/Total # of Brgy:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-1" />
          </div>
          <div className="flex flex-col">
            <label>Indigenous Group:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-1" />
          </div>
          <div className="flex flex-col">
            <label>Source:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-1" />
          </div>
        </div>
        {/* Table Section */}
        <div className="overflow-x-auto mt-8 px-[8rem]">
          <table className="min-w-full border border-gray-300 text-center text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th rowSpan={2} className="border border-gray-300 p-2 w-[10rem]">
                  Age Group
                </th>
                <th colSpan={8} className="border border-gray-300 p-2">
                  Weight for Age Status
                </th>
                <th colSpan={6} className="border border-gray-300 p-2">
                  Total By Age Group
                </th>
              </tr>
              <tr className="bg-gray-200 ">
                <th className="border border-gray-300 p-2">Normal (Boys)</th>
                <th className="border border-gray-300 p-2">Normal (Girls)</th>
                <th className="border border-gray-300 p-2">Underweight (Boys)</th>
                <th className="border border-gray-300 p-2">
                  Underweight (Girls)
                </th>
                <th className="border border-gray-300 p-2">
                  Sev. Underweight (Boys)
                </th>
                <th className="border border-gray-300 p-2">
                  Sev. Underweight (Girls)
                </th>
                <th className="border border-gray-300 p-2">Overweight (Boys)</th>
                <th className="border border-gray-300 p-2">Overweight (Girls)</th>
                <th className="border border-gray-300 p-2">Total</th>
                <th className="border border-gray-300 p-2">Total N</th>
                <th className="border border-gray-300 p-2">Total UW</th>
                <th className="border border-gray-300 p-2">Total SUW</th>
                <th className="border border-gray-300 p-2">Total OT</th>
              </tr>
            </thead>
            <tbody>
              {[
                "0-5 Months",
                "6-11 Months",
                "12-23 Months",
                "24-35 Months",
                "36-47 Months",
                "48-59 Months",
                "60-71 Months",
              ].map((ageGroup, index) => (
                <tr key={index} className="bg-white">
                  <td className="border border-gray-300 p-2">{ageGroup}</td>
                  <td className="border border-gray-300 p-2">{calculateTotals(ageGroup, "Normal", "Male")}</td>
                  <td className="border border-gray-300 p-2">{calculateTotals(ageGroup, "Normal", "Female")}</td>
                  <td className="border border-gray-300 p-2">{calculateTotals(ageGroup, "Underweight", "Male")}</td>
                  <td className="border border-gray-300 p-2">{calculateTotals(ageGroup, "Underweight", "Female")}</td>
                  <td className="border border-gray-300 p-2">{calculateTotals(ageGroup, "Sev. Underweight", "Male")}</td>
                  <td className="border border-gray-300 p-2">{calculateTotals(ageGroup, "Sev. Underweight", "Female")}</td>
                  <td className="border border-gray-300 p-2">{calculateTotals(ageGroup, "Overweight", "Male")}</td>
                  <td className="border border-gray-300 p-2">{calculateTotals(ageGroup, "Overweight", "Female")}</td>
                  <td className="border border-gray-300 p-2">
                    {calculateTotals(ageGroup, "Normal", "Male") + calculateTotals(ageGroup, "Normal", "Female") + 
                     calculateTotals(ageGroup, "Underweight", "Male") + calculateTotals(ageGroup, "Underweight", "Female") + 
                     calculateTotals(ageGroup, "Sev. Underweight", "Male") + calculateTotals(ageGroup, "Sev. Underweight", "Female") + 
                     calculateTotals(ageGroup, "Overweight", "Male") + calculateTotals(ageGroup, "Overweight", "Female")}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {calculateTotals(ageGroup, "Normal", "Male") + calculateTotals(ageGroup, "Normal", "Female")}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {calculateTotals(ageGroup, "Underweight", "Male") + calculateTotals(ageGroup, "Underweight", "Female")}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {calculateTotals(ageGroup, "Sev. Underweight", "Male") + calculateTotals(ageGroup, "Sev. Underweight", "Female")}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {calculateTotals(ageGroup, "Overweight", "Male") + calculateTotals(ageGroup, "Overweight", "Female")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-semibold px-[8rem]">
          Use WEIGHT - for - LENGTH or WEIGHT - for - HEIGHT to correctly determine Overweight and Obesity.
        </p>
        {/* Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 mt-6 px-[8rem]">
          <div className="flex flex-col">
            <label>Prepared By:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-[1rem] w-full" />
            <p className="mt-2">Name & Signature of Nutritional Coordinator</p>
          </div>
          <div className="flex flex-col">
            <label>Checked By:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-[1rem] w-full" />
            <p className="mt-2">Name & Signature of City/Municipal Health</p>
          </div>
          <div className="flex flex-col">
            <label>Approved By:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-[1rem] w-full" />
            <p className="mt-2">Name & Signature of Mayor</p>
          </div>
        </div>
      </div>
            {/* Export Button */}
            <div className="text-center mt-6">
          <button
            onClick={exportToPDF}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Export to PDF
          </button>
        </div>
    </div>
    );
  }
