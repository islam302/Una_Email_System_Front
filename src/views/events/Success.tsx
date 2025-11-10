import SuccessImg from "../../assets/success.svg";

const SuccessPage = () => {
  return (
    <div className="bg-black fixed inset-0 flex items-center justify-center p-5 w-full z-[9999999]">
      <div className="flex flex-col items-center text-center">
        <img className="w-80" src={SuccessImg} alt="Successful Purchase" />
        <h2 className="mt-5 text-[36px] font-bold lg:text-[50px] text-white dark:text-white">
          Successful Purchase!
        </h2>
        <p className="mt-5 lg:text-lg text-white dark:text-white">
          The package or plan has been purchased successfully, <br /> please go
          to the Dashboard homepage to see more!
        </p>
        <div className="flex items-center justify-center space-x-4 my-10">
          {/* <Link
            to={"/dashboard"}
            className={`bg-primary flex flex-row items-center gap-2 py-2 px-8 rounded-md text-base text-white hover:gap-5 duration-150 ${
              isLoading ? "opacity-75 pointer-events-none" : ""
            }`}
            reloadDocument
            onClick={(e) => isLoading && e.preventDefault()}
          >
            {isLoading && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isLoading ? "Loading..." : "Dashboard"}
            <SoArrowRightDouble className="w-5 h-5 text-white" />
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
