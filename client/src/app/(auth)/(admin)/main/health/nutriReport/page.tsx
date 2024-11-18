"use client"
import React from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function ReportForm() {
  const exportToPDF = () => {
    const input = document.getElementById("report-form");
    if (input) {
      html2canvas(input, {
        scale: 2, // Increases the resolution of the canvas
        useCORS: true, // Handles cross-origin images
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait", // Use "landscape" if your content is wide
          unit: "px",
          format: [canvas.width, canvas.height], // Adjusts PDF size to match canvas
        });

        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save("report.pdf");
      }).catch((error) => {
        console.error("Error generating PDF:", error);
      });
    } else {
      console.error("Element with ID 'report-form' not found.");
    }
  };

  return (
   <div className="p-4 bg-gray-50 min-h-screen">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40">
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
      <div className="overflow-x-auto mt-8 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40">
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
            {/* Rows for each Age Group */}
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
                {/* Weight for Age Status cells */}
                {Array(8)
                  .fill(0)
                  .map((_, idx) => (
                    <td key={idx} className="border border-gray-300  p-2">
                      <input type="text" className="w-full p-1 outline-none" />
                    </td>
                  ))}
                {/* Total By Age Group cells */}
                {Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <td key={idx + 8} className="border border-gray-300 p-2">
                      <span className="w-full"></span>
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-semibold px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40">
        Use WEIGHT - for - LENGTH or WEIGHT - for - HEIGHT to correctly determine Overweight and Obesity.
      </p>
      {/* Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40">
        <div className="flex flex-col">
          <label>Prepared By:</label>
          <div className="border-b border-[#cccccc] bg-transparent outline-none p-[1rem] w-full"></div>
          <p className="mt-2">Name & Signature of Nutritional Coordinator</p>
        </div>
        <div className="flex flex-col">
          <label>Checked By:</label>
          <div className="border-b border-[#cccccc] bg-transparent outline-none p-[1rem] w-full"></div>
          <p className="mt-2">Name & Signature of City/Municipal Health</p>
        </div>
        <div className="flex flex-col">
          <label>Approved By:</label>
          <div className="border-b border-[#cccccc] bg-transparent outline-none p-[1rem] w-full"></div>
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
