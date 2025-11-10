import E500Img from "../../assets/errors/500.svg";
import { Link, useLocation } from "react-router-dom";

const ErrorHandler = () => {
  const { pathname } = useLocation();

  return (
    <div className="bg-black fixed inset-0 flex items-center justify-center p-5 w-full z-50">
      <div className="flex flex-col items-center text-center">
        <img
          className="w-64 sm:w-80 lg:w-96"
          src={E500Img}
          alt="500 - خطأ في الخادم"
        />
        <h2 className="mt-5 text-[36px] font-bold lg:text-[50px] text-white dark:text-white">
          500 - خطأ في الخادم
        </h2>
        <p className="mt-5 lg:text-lg text-white dark:text-white">
          عذرًا، حدثت مشكلة في الخادم. جرب تحديث الصفحة أو العودة لاحقًا. <br />
          إذا استمرت المشكلة، تواصل مع فريق الدعم لدينا.
        </p>
        <div className="flex items-center justify-center space-x-4 my-10 space-x-reverse">
          <Link
            to="/"
            className="bg-primary inline-block bg-hover p-2 text-white hover:!text-white rounded-md"
          >
            الرئيسية
          </Link>
          <Link
            to={pathname}
            className="inline-block bg-gray-600 p-2 text-white hover:!text-white rounded-md"
          >
            تحديث
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorHandler;
