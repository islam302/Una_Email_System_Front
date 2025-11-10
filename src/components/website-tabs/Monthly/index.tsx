import { Link } from "react-router-dom";
import "../../dashboard-tabs/Tab.style.css";
import Button from "../../elements/Button";

export default function MonthlyTab() {
  return (
    <div className="w-full h-auto flex flex-row items-center justify-between">
      <div className="w-full flex flex-row items-center justify-between space-x-4 mt-10 max-sm:flex-col max-sm:space-y-4 max-sm:space-x-0">
        <div className="w-2/6 bg-white p-3 rounded-2xl flex flex-col items-center justify-between space-y-4 relative overflow-hidden max-sm:w-full">
          <div
            className="absolute top-[-15px] left-[-135px] w-56 h-56 rounded-full"
            style={{
              background: "linear-gradient(135deg, #5B93FF 0%, #ffffff 100%)",
            }}
          ></div>
          <div className="flex flex-col items-center justify-between space-y-8">
            <h3 className="text-[#5B93FF] text-3xl font-semibold mt-2">
              Premium
            </h3>
            <div className="bg-[#FFF4F0] p-2 px-3 rounded-xl">
              <h2 className="text-[#5B93FF] text-5xl font-bold">$50</h2>
            </div>
            <h3 className="text-black text-2xl font-medium">10,000 Message</h3>
          </div>
          <Link className="w-full" to={"/dashboard/financial/order"}>
            <Button fullWidth className="bg-[#5B93FF] hover:bg-[#5B93FF]/90">
              Choose Plan
            </Button>
          </Link>
        </div>
        <div className="w-2/6 bg-white p-3 rounded-2xl flex flex-col items-center justify-between space-y-4 relative overflow-hidden max-sm:w-full">
          <div
            className="absolute top-[-15px] left-[-135px] w-56 h-56 rounded-full"
            style={{
              background: "linear-gradient(135deg, #FF8F6B 0%, #ffffff 100%)",
            }}
          ></div>
          <div className="flex flex-col items-center justify-between space-y-8">
            <h3 className="text-[#FF8F6B] text-3xl font-semibold mt-2">
              Standard
            </h3>
            <div className="bg-[#FFF4F0] p-2 px-3 rounded-xl">
              <h2 className="text-[#FF8F6B] text-5xl font-bold">$30</h2>
            </div>
            <h3 className="text-black text-2xl font-medium">5,000 Message</h3>
          </div>
          <Link className="w-full" to={"/dashboard/financial/order"}>
            <Button fullWidth className="bg-[#FF8F6B] hover:bg-[#FF8F6B]/90">
              Choose Plan
            </Button>
          </Link>
        </div>
        <div className="w-2/6 bg-white p-3 rounded-2xl flex flex-col items-center justify-between space-y-4 relative overflow-hidden max-sm:w-full">
          <div
            className="absolute top-[-15px] left-[-135px] w-56 h-56 rounded-full"
            style={{
              background: "linear-gradient(135deg, #FFC327 0%, #ffffff 100%)",
            }}
          ></div>
          <div className="flex flex-col items-center justify-between space-y-8">
            <h3 className="text-[#FFC327] text-3xl font-semibold mt-2">
              Essentials
            </h3>
            <div className="bg-[#FFF4F0] p-2 px-3 rounded-xl">
              <h2 className="text-[#FFC327] text-5xl font-bold">$20</h2>
            </div>
            <h3 className="text-black text-2xl font-medium">2,000 Message</h3>
          </div>
          <Link className="w-full" to={"/dashboard/financial/order"}>
            <Button fullWidth className="bg-[#FFC327] hover:bg-[#FFC327]/90">
              Choose Plan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
