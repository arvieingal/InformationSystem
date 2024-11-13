'use client';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const SweetAlert = {
  showError: (message: string) => {
    return MySwal.fire({
      title: "<span class='text text-[20px] flex justify-center font-bold tracking-widest'>FAILED</span>",
      html: `<span class='text-[14px] py-7 text font-regular text-center justify-center flex'>${message}</span>`,
      confirmButtonText: "TRY AGAIN",
      width: 350,
      customClass: {
        popup: "rounded-[25px] shadow-lg h-[250px]",
        title: "font-bold border-b-2 text-black-900",
        confirmButton: "bg-[#24968B] text-white w-[120px] h-[35px] font-semibold mb-1 rounded-[7px]",
      },
      buttonsStyling: false,
    });
  },

  showSkipReplace: async (message: string) => {
    const result = await MySwal.fire({
      title: "<span class='text text-[20px] flex justify-center font-bold tracking-widest'>CONFIRM</span>",
      html: `<span class='text text-[14px] font-regular text-center justify-center flex flex-col pt-2 '>${message}</span>`,
      showCancelButton: true,
      cancelButtonText: "Skip",
      confirmButtonText: "Replace",
      width: 350,
      reverseButtons: true,
      customClass: {
        popup: "rounded-[25px] shadow-lg h-[400px]",
        title: "font-bold  border-b-2 text-black-900 tracking-widest",
        cancelButton: "bg-[#E80000] text-[14px] text-white w-[100px] h-[35px] font-semibold mb-1 rounded-[7px] hover:bg-red-800 mr-[12px]",
        confirmButton: "bg-[#24968B] text-[14px] text-white w-[100px] h-[35px] font-semibold mb-1 rounded-[7px] hover:bg-green-900 outline-none ml-1",
      },
      buttonsStyling: false
    });
    return result.isConfirmed;
  },
  showConfirm: async (message: string) => {
    const result = await MySwal.fire({
      title: "<span class='text text-[20px] flex justify-center font-bold tracking-widest'>CONFIRM</span>",
      html: `<span class='text  text-[16px] font-medium text-center justify-center flex pt-7 '>${message}</span>`,
      showCancelButton: true,
      cancelButtonText: "CANCEL",
      confirmButtonText: "CONFIRM",
      width: 350,
      reverseButtons: true,
      customClass: {
        popup: "rounded-[25px] shadow-lg h-[250px]",
        title: "font-bold  border-b-2 text-black-900 tracking-widest",
        cancelButton: "bg-[#E80000] text-white w-[100px] h-[35px] font-semibold mb-1 rounded-[7px] text-[14px] hover:bg-red-800 mr-[12px]",
        confirmButton: "bg-[#24968B] text-white w-[100px] h-[35px] font-semibold mb-1 rounded-[7px] hover:bg-green-900 ml-1 outline-none",
      },
      buttonsStyling: false
    });
    return result.isConfirmed;
  },
  showSuccess: async (message: string) => {
    const result = await MySwal.fire({
      title: "<span class='text text-[20px] flex justify-center font-bold tracking-widest '>SUCCESS</span>",
      html: `<span class=' text-[14px] text font-regular text-center justify-center flex pt-[2rem] '>${message}</span>`,
      confirmButtonText: "CONTINUE",
      width: 350,
      customClass: {
        popup: "rounded-[25px] shadow-lg h-[250px] ",
        title: "text-[16px] font-bold border-b-2 text-black-900 ",
        confirmButton: "bg-[#24968B] text-white w-[120px] h-[35px] font-semibold mb-1 rounded-[7px] hover:bg-green-900 outline-none"
      },
      buttonsStyling: false
    });
    return result.isConfirmed;
  },
  showTheSuccess: async (message: string) => {
    const result = await MySwal.fire({
      title: "<span class='text text-[20px] flex justify-center font-bold tracking-widest '>SUCCESS</span>",
      html: `<span class=' text-[14px] text font-regular text-center justify-center flex pt-[2rem] '>${message}</span>`,
      confirmButtonText: "OK",
      width: 350,
      customClass: {
        popup: "rounded-[25px] shadow-lg h-[250px] ",
        title: "text-[16px] font-bold border-b-2 text-black-900 ",
        confirmButton: "bg-[#24968B] text-white w-[120px] h-[35px] font-semibold mb-1 rounded-[7px] hover:bg-green-900"
      },
      buttonsStyling: false
    });
    return result.isConfirmed;
  },
  checkInternetConnection: () => {
    return navigator.onLine;
  },
  displayAlertIfNoInternet: () => {
    if (!SweetAlert.checkInternetConnection()) {
      MySwal.fire({
        title: "<span class='text text-[20px] font-bold tracking-widest'>FAILED</span>",
        html: "<span class=' text-[14px] text  font-regular text-center justify-center flex pt-2 text'>Sometimes things don't go as planned.<br>Please try again</br></span>",
        confirmButtonText: "TRY AGAIN",
        width: 350,
        customClass: {
          popup: "rounded-[25px]  shadow-lg h-[250px]",
          title: "text-[16px] font-bold border-b-2 tracking-widest",
          confirmButton: "bg-[#24968B] text-white w-[120px] h-[35px] font-semibold mb-5 rounded-[25px] hover:bg-red-800"
        },
      buttonsStyling: false 
    });
      return false; 
    }
    return true; 
  },
};

export default SweetAlert;
