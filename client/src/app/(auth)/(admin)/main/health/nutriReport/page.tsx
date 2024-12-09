"use client"
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface ChildData {
  age_group: string;
  nutritional_status: string;
  sex: string;
  purok: string;
}

interface PurokStatus {
  sitio_purok: string;
  nutritional_status: string;
  count: number;
}


export default function ReportForm() {
  const [categorizedData, setCategorizedData] = useState<ChildData[]>([]);
  const [purokStatusData, setPurokStatusData] = useState<PurokStatus[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorizedData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/children/count/categorized`);
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

    const fetchPurokStatusData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/status/purok`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPurokStatusData(data);
      } catch (error) {
        console.error("Error fetching purok status data:", error);
        setError("Failed to fetch purok status data.");
      }
    };

    fetchCategorizedData();
    fetchPurokStatusData();
  }, []);

  const calculateTotals = (ageGroup: string, status: string, gender: string) => {
    return categorizedData.filter(
      (child) => child.age_group === ageGroup && child.nutritional_status === status && child.sex === gender
    ).length;
  };

  const transformPurokData = () => {
    const transformedData = purokStatusData.reduce((acc, { sitio_purok, nutritional_status, count }) => {
      if (!acc[sitio_purok]) {
        acc[sitio_purok] = { "Sev. Underweight": 0, "Underweight": 0, "Normal": 0, "Overweight": 0, "Obese": 0 };
      }
      acc[sitio_purok][nutritional_status] = count;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    return transformedData;
  };

  const calculatePurokStatusTotals = (purok: string, status: string) => {
    const transformedData = transformPurokData();
    return transformedData[purok]?.[status] || 0;
  };

  const exportSectionToPDF = (sectionId: string, fileName: string) => {
    const input = document.getElementById(sectionId);
    if (input) {
      const clonedNode = input.cloneNode(true) as HTMLElement;
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '100%'; // Ensure full width

      tempContainer.appendChild(clonedNode);
      document.body.appendChild(tempContainer);

      const exportButtons = clonedNode.querySelectorAll('.export-button');
      exportButtons.forEach(button => (button as HTMLElement).style.display = 'none');

      if (sectionId !== 'report-form') {
        const headerSection = document.querySelector('.text-center.mb-4');
        if (headerSection) {
          const clonedHeader = headerSection.cloneNode(true) as HTMLElement;
          tempContainer.insertBefore(clonedHeader, clonedNode);
        }

        const generalInfo = document.querySelector('.grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-4');
        if (generalInfo) {
          const clonedGeneralInfo = generalInfo.cloneNode(true) as HTMLElement;
          tempContainer.insertBefore(clonedGeneralInfo, clonedNode);
        }
      }

      const footerSection = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3.gap-20.mt-20.px-\\[8rem\\]');
      if (footerSection) {
        const clonedFooter = footerSection.cloneNode(true) as HTMLElement;
        tempContainer.appendChild(clonedFooter);
      }

      html2canvas(tempContainer, {
        scale: 3,
        useCORS: true,
        width: tempContainer.scrollWidth,
        height: tempContainer.scrollHeight + 100,
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

        const xOffset = (imgWidth - finalWidth) / 2; // Center horizontally
        const yOffset = (imgHeight - finalHeight) / 2; // Center vertically

        pdf.addImage(imgData, "PNG", xOffset, yOffset, finalWidth, finalHeight);
        pdf.save(fileName);

        document.body.removeChild(tempContainer);
      }).catch((error) => {
        console.error("Error generating PDF:", error);
      });
    } else {
      console.error(`Element with ID '${sectionId}' not found.`);
    }
  };

  const exportFullReportToPDF = (fileName: string) => {
    const reportForm = document.getElementById('report-form');
    if (reportForm) {
      const clonedReportForm = reportForm.cloneNode(true) as HTMLElement;
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.appendChild(clonedReportForm);
      document.body.appendChild(tempContainer);
      const exportButtons = clonedReportForm.querySelectorAll('.export-button');
      exportButtons.forEach(button => (button as HTMLElement).style.display = 'none');
      const headerSection = clonedReportForm.querySelector('.text-center.mb-4');
      const generalInfo = clonedReportForm.querySelector('.grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-4');
      const ageGroupTable = clonedReportForm.querySelector('#age-group-table');
      const purokStatusTable = clonedReportForm.querySelector('#purok-status-table');
      const footerSection = clonedReportForm.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3.gap-20.mt-20.px-\\[8rem\\]');
      const page1Container = document.createElement('div');
      const page2Container = document.createElement('div');
      if (headerSection) page1Container.appendChild(headerSection.cloneNode(true));
      if (generalInfo) page1Container.appendChild(generalInfo.cloneNode(true));
      if (ageGroupTable) page1Container.appendChild(ageGroupTable.cloneNode(true));
      if (purokStatusTable) page2Container.appendChild(purokStatusTable.cloneNode(true));
      if (footerSection) page2Container.appendChild(footerSection.cloneNode(true));

      tempContainer.appendChild(page1Container);
      tempContainer.appendChild(page2Container);

      // Render first page
      html2canvas(page1Container, {
        scale: 3,
        useCORS: true,
        width: page1Container.scrollWidth,
        height: page1Container.scrollHeight,
      }).then((canvas1) => {
        const imgData1 = canvas1.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        const imgWidth = 297;
        const imgHeight = 210;
        const canvasWidth1 = canvas1.width;
        const canvasHeight1 = canvas1.height;
        const ratio1 = Math.min(imgWidth / canvasWidth1, imgHeight / canvasHeight1);
        const finalWidth1 = canvasWidth1 * ratio1; 
        const finalHeight1 = canvasHeight1 * ratio1; 
        pdf.addImage(imgData1, "PNG", 0, 0, finalWidth1, finalHeight1);

        // Render second page
        html2canvas(page2Container, {
          scale: 3,
          useCORS: true,
          width: page2Container.scrollWidth,
          height: page2Container.scrollHeight,
        }).then((canvas2) => {
          const imgData2 = canvas2.toDataURL("image/png");
          const canvasWidth2 = canvas2.width;
          const canvasHeight2 = canvas2.height;
          const ratio2 = Math.min(imgWidth / canvasWidth2, imgHeight / canvasHeight2);
          const finalWidth2 = canvasWidth2 * ratio2;
          const finalHeight2 = canvasHeight2 * ratio2;

          pdf.addPage();
          pdf.addImage(imgData2, "PNG", 0, 0, finalWidth2, finalHeight2);
          pdf.save(fileName);

          document.body.removeChild(tempContainer);
        }).catch((error) => {
          console.error("Error generating second page PDF:", error);
        });
      }).catch((error) => {
        console.error("Error generating first page PDF:", error);
      });
    } else {
      console.error(`Element with ID 'report-form' not found.`);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 px-[8rem] mt-[4rem] text-base">
          <div className="flex flex-col"> 
            <label>Municipality/City:</label>
            <input type="text" className="border-b p-2 border-[#cccccc] bg-transparent outline-none " />
          </div>
          <div className="flex flex-col">
            <label>Total Population:</label>
            <input type="text" className="border-b p-2 border-[#cccccc] bg-transparent outline-none " />
          </div>
          <div className="flex flex-col">
            <label>Estimated No. of PS:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-2" />
          </div>
          <div className="flex flex-col mt-[1rem]">
            <label>0 - 59 months old:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-2" />
          </div>
          <div className="flex flex-col">
            <label>Province:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-2" />
          </div>
          <div className="flex flex-col">
            <label>Year OPT Plus:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-2" />
          </div>
          <div className="flex flex-col">
            <label>Actual No. of PS measured :</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-2" />
          </div>
          <div className="flex flex-col">
            <label>0 - 71 months old:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-2" />
          </div>
          <div className="flex flex-col">
            <label>Region:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-2" />
          </div>
          <div className="flex flex-col">
            <label>Prevalence Rate UW + SUW:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-2" />
          </div>
          <div className="flex flex-col">
            <label>Percent OPT Plus Coverage:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 px-[8rem]">
          <div className="flex flex-col">
            <label>Total # of Barangays:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-2" />
          </div>
          <div className="flex flex-col">
            <label>0 - 59 months:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-2" />
          </div>
          <div className="flex flex-col">
            <label>No. of Indigenous PS measured:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-2" />
          </div>
          <div className="flex flex-col">
            <label>Total # of Brgy with OPT Plus Results/Total # of Brgy:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-2" />
          </div>
          <div className="flex flex-col">
            <label>Indigenous Group:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-2" />
          </div>
          <div className="flex flex-col">
            <label>Source:</label>
            <input type="text" className="border-b border-[#cccccc] bg-transparent outline-none p-2" />
          </div>
        </div>
        {/* Age Group Table */}
        <div id="age-group-table" className="overflow-x-auto mt-[4rem] px-[8rem]">
          <table className="min-w-full border border-gray-300 text-center text-base">
            <thead>
              <tr className="bg-gray-200">
                <th rowSpan={2} className="border border-gray-300 p-2 text-ellipsis ">
                  Age Group in Months
                </th>
                <th colSpan={8} className="border border-gray-300 p-2">
                  Weight for Age Status
                </th>
                <th colSpan={5} className="border border-gray-300 p-2">
                  Total By Age Group
                </th>
              </tr>
              <tr className="bg-gray-200 text-[16px]">
                <th className="border border-gray-300 p-2">Normal (Boys)</th>
                <th className="border border-gray-300 p-2">Normal (Girls)</th>
                <th className="border border-gray-300 p-2">Underweight (Boys)</th>
                <th className="border border-gray-300 p-2">Underweight (Girls)</th>
                <th className="border border-gray-300 p-2">Sev. Underweight (Boys)</th>
                <th className="border border-gray-300 p-2">Sev. Underweight (Girls)</th>
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
                <tr key={index} className="bg-white text-[16px]">
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



        {/* New Purok Status Table */}
        <div id="purok-status-table" className="overflow-x-auto mt-8 px-[8rem]">
          <h3 className="text-lg font-semibold mb-4">Purok Status</h3>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="min-w-full border border-gray-300 text-center text-base mx-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Brgy. Luz Sitio</th>
                  <th className="border border-gray-300 p-2">Sev. Underweight</th>
                  <th className="border border-gray-300 p-2">Underweight</th>
                  <th className="border border-gray-300 p-2">Normal</th>
                  <th className="border border-gray-300 p-2">Overweight</th>
                  <th className="border border-gray-300 p-2">Obese</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(transformPurokData()).map(([purok, statuses]) => (
                  <tr key={purok} className="bg-white">
                    <td className="border border-gray-300 p-2">{purok}</td>
                    <td className="border border-gray-300 p-2">{statuses["Sev. Underweight"] || 0}</td>
                    <td className="border border-gray-300 p-2">{statuses["Underweight"] || 0}</td>
                    <td className="border border-gray-300 p-2">{statuses["Normal"] || 0}</td>
                    <td className="border border-gray-300 p-2">{statuses["Overweight"] || 0}</td>
                    <td className="border border-gray-300 p-2">{statuses["Obese"] || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="font-semibold px-[8rem]">
          Use WEIGHT - for - LENGTH or WEIGHT - for - HEIGHT to correctly determine Overweight and Obesity.
        </p>
        {/* Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 mt-20 px-[8rem]">
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

        <div className="flex flex-row gap-[20px] items-center justify-center">
          {/* Export Button for Age Group Table */}
          <div className="text-center mt-6">
            <button
              onClick={() => exportSectionToPDF('age-group-table', 'age_group_table.pdf')}
              className="bg-blue-500 text-white px-4 py-2 rounded export-button"
            >
              Export Age Group Table to PDF
            </button>
          </div>

          {/* Export Button for Purok Table */}
          <div className="text-center items-center justify-center mt-6">
            <button
              onClick={() => exportSectionToPDF('purok-status-table', 'purok_table.pdf')}
              className="bg-blue-500 text-white px-4 py-2 rounded export-button"
            >
              Export Purok Table to PDF
            </button>
          </div>

          {/* Export Button for Entire Form and Age Group Table */}
          <div className="text-center mt-6">
            <button
              onClick={() => exportFullReportToPDF('full_report.pdf')}
              className="bg-blue-500 text-white px-4 py-2 rounded export-button"
            >
              Export Full Report to PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
