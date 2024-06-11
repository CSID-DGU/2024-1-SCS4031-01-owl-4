import { useFormContext } from "react-hook-form";
import useResponseStore from "../utils/useResponseStore";
import { MdOutlineErrorOutline } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

const StartSecondSettingForm = () => {
  const { access_key, secret_key, setAccessKey, setSecretKey } =
    useResponseStore();
  const [showAPI, setShowAPI] = useState(false);
  const [showAPISecret, setShowAPISecret] = useState(false);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="w-full h-full flex flex-col">
      <div>
        <span className="font-bold text-sm text-slate-400">
          서비스 이용을 위해
        </span>
        <h1 className="font-bold text-lg mt-1">
          <a
            href="https://upbit.com/service_center/open_api_guide"
            className=" text-blue-600 border-b-2 border-blue-600"
          >
            UPbit
          </a>
          의 API 키를 입력해주세요.
        </h1>
      </div>
      <h1 className="font-bold text-slate-400 mt-4">ACCESS KEY</h1>
      <div className="w-full relative transition-all mt-2">
        <input
          type={showAPI ? "text" : "password"}
          className={`peer outline-none mt-2 w-full border-[1.5px] rounded-lg pl-10 py-2 duration-300 
              ${
                errors["access_key"] || access_key.length
                  ? ""
                  : "border-slate-400 bg-slate-50 hover:border-violet-500 focus:border-violet-500 focus:bg-white"
              } 
              ${
                !access_key.length
                  ? "border-red-500"
                  : "border-green-500 focus:border-green-500 bg-white focus:bg-white"
              }`}
          {...register("access_key")}
          onChange={(e) => setAccessKey(e.target.value)}
          value={access_key}
        />

        <div
          className={`absolute left-2 top-4 size-[25px] rounded-full border-[1.5px] flex items-center justify-center font-bold text-lg select-none
              ${
                errors["access_key"] || access_key.length
                  ? ""
                  : "border-slate-400 text-slate-400 peer-focus:border-violet-500 peer-focus:text-violet-500 peer-hover:border-violet-500 peer-hover:text-violet-500"
              } 
              ${
                !access_key.length
                  ? "border-red-500 text-red-500"
                  : "border-green-500 text-green-500 peer-focus:border-green-500 peer-focus:text-green-500"
              }`}
        >
          A
        </div>
        <MdOutlineErrorOutline
          className={`absolute top-5 right-3 duration-300 ${
            errors["access_key"] ? "" : "text-transparent"
          } ${!access_key.length ? "text-red-500" : "text-transparent"}`}
        />
        <FaRegCheckCircle
          className={`absolute top-5 right-3 duration-300 ${
            access_key.length ? "text-green-500" : "text-transparent"
          }`}
        />
        {showAPI ? (
          <FaEye
            className={`absolute top-5 text-slate-400 duration-300
              ${
                errors["access_key"] || access_key.length
                  ? "right-10"
                  : "right-3"
              } `}
            onClick={() => setShowAPI(false)}
          />
        ) : (
          <FaEyeSlash
            className={`absolute top-5 text-slate-400 duration-300
              ${
                errors["access_key"] || access_key.length
                  ? "right-10"
                  : "right-5"
              }`}
            onClick={() => setShowAPI(true)}
          />
        )}
      </div>
      <h1 className="font-bold text-slate-400 mt-7 select-none">SECRET KEY</h1>
      <div className="w-full relative transition-all mt-2">
        <input
          type={showAPISecret? "text":"password"}
          className={`peer outline-none mt-2 w-full border-[1.5px] rounded-lg pl-10 py-2 duration-300 
              ${
                errors["secret_key"] || secret_key.length
                  ? ""
                  : "border-slate-400 bg-slate-50 hover:border-violet-500 focus:border-violet-500 focus:bg-white"
              } 
              ${
                !secret_key.length
                  ? "border-red-500"
                  : "border-green-500 focus:border-green-500 bg-white focus:bg-white"
              }`}
          {...register("secret_key")}
          onChange={(e) => setSecretKey(e.target.value)}
          value={secret_key}
        />

        <div
          className={`absolute left-2 top-4 size-[25px] rounded-full border-[1.5px] flex items-center justify-center font-bold text-lg select-none
              ${
                errors["secret_key"] || secret_key.length
                  ? ""
                  : "border-slate-400 text-slate-400 peer-focus:border-violet-500 peer-focus:text-violet-500 peer-hover:border-violet-500 peer-hover:text-violet-500"
              } 
              ${
                !secret_key.length
                  ? "border-red-500 text-red-500"
                  : "border-green-500 text-green-500 peer-focus:border-green-500 peer-focus:text-green-500"
              }`}
        >
          S
        </div>
        <MdOutlineErrorOutline
          className={`absolute top-5 right-3 duration-300 ${
            errors["secret_key"] ? "" : "text-transparent"
          } ${!secret_key.length ? "text-red-500" : "text-transparent"}`}
        />
        <FaRegCheckCircle
          className={`absolute top-5 right-3 duration-300 ${
            secret_key.length ? "text-green-500" : "text-transparent"
          }`}
        />
        {showAPISecret ? (
          <FaEye
            className={`absolute top-5 text-slate-400 duration-300
              ${
                errors["secret_key"] || secret_key.length
                  ? "right-10"
                  : "right-3"
              } `}
            onClick={() => setShowAPISecret(false)}
          />
        ) : (
          <FaEyeSlash
            className={`absolute top-5 text-slate-400 duration-300
              ${
                errors["secret_key"] || secret_key.length
                  ? "right-10"
                  : "right-5"
              }`}
            onClick={() => setShowAPISecret(true)}
          />
        )}
      </div>
    </div>
  );
};

export default StartSecondSettingForm;
