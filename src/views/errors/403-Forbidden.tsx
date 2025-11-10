import E403Img from "../../assets/errors/403.svg";
import { Link, useLocation } from "react-router-dom";

const ForbiddenPage = () => {
  const { pathname } = useLocation();
  return (
    <div className="bg-black fixed inset-0 flex items-center justify-center p-5 w-full z-[9999999]">
      <div className="flex flex-col items-center text-center">
        <img className="w-72" src={E403Img} alt="403 - الوصول غير مسموح" />
        <h2 className="mt-5 text-[36px] font-bold lg:text-[50px] text-white dark:text-white">
          403 - غير مسموح
        </h2>
        <p className="mt-5 lg:text-lg text-white dark:text-white">
          عذرًا، لا يمكنك الوصول إلى هذه الصفحة. جرب تحديث الصفحة أو العودة
          لاحقًا. <br />
          إذا استمرت المشكلة، تواصل مع فريق الدعم لدينا.
        </p>
        <div className="flex items-center justify-center space-x-4 my-10 space-x-reverse">
          <Link
            to="/"
            className="bg-primary inline-block bg-hover p-2 text-white hover:!text-white rounded-md"
            reloadDocument
          >
            الرئيسية
          </Link>
          <Link
            to={pathname}
            className="inline-block bg-font p-2 text-white hover:!text-white rounded-md"
            reloadDocument
          >
            تحديث
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
