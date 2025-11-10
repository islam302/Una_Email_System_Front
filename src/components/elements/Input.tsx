import { useTranslation } from "@/i18n/hooks";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes, Ref, forwardRef, useState } from "react";
import { SoEye } from "solom-icon";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef(
  ({ type, className, ...rest }: IProps, ref: Ref<HTMLInputElement>) => {
    const { i18n } = useTranslation("recipient");
    const currentLng = i18n.language;

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={type === "password" && showPassword ? "text" : type}
          style={{
            textAlign: currentLng === "ar" ? "right" : "left",
          }}
          className={`border border-gray-300 text-gray-400 focus:outline-none outline-none focus:ring-1 focus:ring-primary rounded-lg px-3 py-3 text-md w-full bg-transparent duration-200 ${className}`}
          {...rest}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={cn(
              "absolute top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary",
              currentLng === "ar" ? "left-4" : "right-4"
            )}
          >
            {showPassword ? (
              <SoEye className="w-5 h-5 text-primary" />
            ) : (
              <SoEye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    );
  }
);

export default Input;
