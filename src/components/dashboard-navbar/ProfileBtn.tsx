import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { clearToken, tokenSelector } from "../../app/functions/token";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { toast } from "react-fox-toast";
import {
  SoArrowDown,
  SoHome,
  SoSend,
  SoSquareArrowDownLeft,
  SoUser,
} from "solom-icon";
import { useAppDispatch } from "@/app/store";

export default function ProfileBtn() {
  const cookie = new Cookies();
  const { username } = useSelector(tokenSelector);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(clearToken());
    cookie.remove("userLoggedES");
    cookie.remove("elNamerEmailSender");

    toast.success("تم تسجيل خروجك بنجاح!");
    setTimeout(() => {
      window.location.replace("/");
    }, 50);
  };

  return (
    <div className="w-full max-w-sm px-4">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? "text-white" : "text-white/90"}
                group inline-flex items-center rounded-md bg-white px-1 py-2 text-base font-medium hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-3">
                  <div className="bg-accent rounded-full p-1">
                    <SoUser className="text-primary w-5 h-5" />
                  </div>
                  <span className="text-base text-primary">{username}</span>
                </div>
              </div>
              <SoArrowDown
                className={`${open ? "text-primary" : "text-accent"}
                  mr-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-accent/80`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-3 sm:px-0 lg:max-w-xs">
                <div className="bg-gray-50 overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5 z-20">
                  <div className="my-2 px-2">
                    <Link
                      to="/dashboard/home"
                      className="flow-root rounded-md px-2 py-2 transition hover:bg-[#ebe7e7] ease-in-out duration-200 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                    >
                      <span className="flex items-center gap-3">
                        <SoHome className="w-5 h-5 text-primary" />
                        <span className="text-base font-medium text-primary">
                          لوحة التحكم
                        </span>
                      </span>
                    </Link>
                  </div>
                  <div className="my-2 px-2">
                    <Link
                      to="/dashboard/send/user"
                      className="flow-root rounded-md px-2 py-2 transition hover:bg-[#ebe7e7] ease-in-out duration-200 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                    >
                      <span className="flex items-center gap-3">
                        <SoSend className="w-5 h-5 text-primary" />
                        <span className="text-base font-medium text-primary">
                          ارسال رسائل
                        </span>
                      </span>
                    </Link>
                  </div>
                  <div className="my-2 px-2">
                    <Link
                      to="/"
                      onClick={handleLogout}
                      className="flow-root rounded-md px-2 py-2 transition hover:bg-[#ebe7e7] ease-in-out duration-200 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                    >
                      <span className="flex items-center gap-3">
                        <SoSquareArrowDownLeft className="w-5 h-5 text-red-600" />
                        <span className="text-base font-medium text-red-600">
                          تسجيل الخروج
                        </span>
                      </span>
                    </Link>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
