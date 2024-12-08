"use client";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const SweetAlert = {
  showError: (message: string) => {
    return MySwal.fire({
      title:
        "<span class='text text-[#F24822] text-[26px] flex justify-center font-bold tracking-widest '>FAILED</span>",
      html: `<span class=' text-[20px] text font-regular text-center justify-center flex'>${message}</span>`,
      confirmButtonText: "OK",
      width: 700,
      customClass: {
        popup: "rounded-[25px] shadow-lg",
        confirmButton:
          "bg-[#24968B] text-white px-12 font-semibold mb-1 text-[18px] rounded-[7px] hover:bg-green-900 outline-none  py-2",
      },
      buttonsStyling: false,
    });
  },

  showConfirm: async (message: string) => {
    const result = await MySwal.fire({
      title: "",
      html: `<div class='text-[24px] text-[#338A80] font-medium text-center justify-center flex pt-6'>${message}</div>`,
      showCancelButton: true,
      cancelButtonText: "NO",
      confirmButtonText: "YES",
      width: 700,
      customClass: {
        popup: "rounded-[25px] shadow-lg",
        cancelButton:
          "border-2 px-12 font-semibold mb-1 rounded-[7px] text-[18px] hover:bg-gray-400 py-2",
        confirmButton:
          "bg-[#24968B] text-white px-12 font-semibold mb-1 text-[18px] rounded-[7px] hover:bg-green-900 outline-none  mr-12  py-2",
      },
      buttonsStyling: false,
    });
    return result.isConfirmed;
  },

  showSuccess: async (message: string) => {
    const result = await MySwal.fire({
      title:
        "<span class='text text-[#338A80] text-[26px] flex justify-center font-bold tracking-widest '>SUCCESS</span>",
      html: `<span class=' text-[20px] text font-regular text-center justify-center flex'>${message}</span>`,
      confirmButtonText: "CONTINUE",
      width: 700,
      customClass: {
        popup: "rounded-[25px] shadow-lg",
        confirmButton:
          "bg-[#24968B] text-white px-12 font-semibold mb-1 text-[18px] rounded-[7px] hover:bg-green-900 outline-none  py-2",
      },
      buttonsStyling: false,
    });
    return result.isConfirmed;
  },

  checkInternetConnection: () => {
    return navigator.onLine;
  },

  displayAlertIfNoInternet: () => {
    if (!SweetAlert.checkInternetConnection()) {
      MySwal.fire({
        title:
          "<span class='text text-[#338A80] text-[26px] flex justify-center font-bold tracking-widest '>FAILED</span>",
        html: "<span class=' text-[20px] text  font-regular text-center justify-center flex pt-2 text'>Sometimes things don't go as planned.<br>Please try again</br></span>",
        confirmButtonText: "TRY AGAIN",
        width: 700,
        customClass: {
          popup: "rounded-[25px] shadow-lg",
          confirmButton:
            "bg-[#24968B] text-white px-12 font-semibold mb-1 text-[18px] rounded-[7px] hover:bg-green-900 outline-none  py-2",
        },
        buttonsStyling: false,
      });
      return false;
    }
    return true;
  },

  showSkipReplace: async (message: string) => {
    const result = await MySwal.fire({
      title:
        "<span class='text text-[20px] flex justify-center font-bold tracking-widest'>CONFIRM</span>",
      html: `<span class='text text-[14px] font-regular text-center justify-center flex flex-col pt-2 '>${message}</span>`,
      showCancelButton: true,
      cancelButtonText: "Skip",
      confirmButtonText: "Replace",
      width: 350,
      reverseButtons: true,
      customClass: {
        popup: "rounded-[25px] shadow-lg h-[400px]",
        title: "font-bold  border-b-2 text-black-900 tracking-widest",
        cancelButton:
          "bg-[#E80000] text-[14px] text-white w-[100px] h-[35px] font-semibold mb-1 rounded-[7px] hover:bg-red-800 mr-[12px]",
        confirmButton:
          "bg-[#24968B] text-[14px] text-white w-[100px] h-[35px] font-semibold mb-1 rounded-[7px] hover:bg-green-900 outline-none ml-1",
      },
      buttonsStyling: false,
    });
    return result.isConfirmed;
  },
};

export default SweetAlert;
