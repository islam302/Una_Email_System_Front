import { Outlet } from "react-router-dom";

const PagesLayout = () => {
  return (
    <div className="dashboard-layout bg-[#E8F0F714]">
      <div className="flex flex-row w-full h-full">
        <div className="container mx-0 px-0 w-full max-w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PagesLayout;
