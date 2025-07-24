import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function Error() {
  const navigate = useNavigate();

  return (
    <div className="mt-20 flex flex-col justify-center items-center flex-1 text-3xl font-medium">
      <div className="flex flex-col justify-center items-center gap-6 border border-slate-200 bg-slate-100 shadow w-[450px] h-[200px] rounded-xl sm:w-[400px] smxl:w-[300px]">
        <div className="flex items-center justify-center text-center rounded-lg sm:w-[60%0] sm:w-[70%] sm:text-2xl">
          Error 404 - Page Not Found
        </div>
        <button
          className="bg-black text-base text-white py-1.5 px-4 rounded flex items-center gap-4 shadow"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="text-sm" />
          Go Back
        </button>
      </div>
    </div>
  );
}

export default Error;
