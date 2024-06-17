import { useFormContext } from "react-hook-form";
import useResponseStore from "../utils/useResponseStore";
import { MdOutlineErrorOutline } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const StartSecondSettingForm = () => {
  const {
    access_key,
    secret_key,
    setAccessKey,
    setSecretKey,
    errIpState,
    errKeyState,
    showAPI,
    showAPISecret,
    setErrIpState,
    setErrKeyState,
    setShowAPI,
    setShowAPISecret,
  } = useResponseStore();
  const {
    register: keyRegister,
    formState: { errors: keyErrors },
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
            target="_blenk"
          >
            UPbit
          </a>
          의 API 키를 입력해주세요.
        </h1>
        <h1 className="font-bold text-slate-400 mt-4">ACCESS KEY</h1>
        <div className="w-full relative transition-all mt-2">
          <input
            type={showAPI ? "text" : "password"}
            className={`peer outline-none mt-2 w-full border-[1.5px] rounded-lg pl-10 py-2 duration-300 
              ${
                keyErrors["access_key"] || access_key.length
                  ? ""
                  : "border-slate-400 bg-slate-50 hover:border-violet-500 focus:border-violet-500 focus:bg-white"
              } 
              ${
                access_key.length < 40 || errKeyState || errIpState
                  ? "border-red-500"
                  : "border-green-500 focus:border-green-500 bg-white focus:bg-white"
              }`}
            {...keyRegister("access_key")}
            onChange={(e) => {
              setAccessKey(e.target.value);
              setErrKeyState(false);
              setErrIpState(false);
              if (access_key.length >= 40) {
                keyErrors["access_key"] = false;
              }
            }}
            value={access_key}
          />

          <div
            className={`absolute left-2 top-4 size-[25px] rounded-full border-[1.5px] flex items-center justify-center font-bold text-lg select-none
              ${
                keyErrors["access_key"] || access_key.length
                  ? ""
                  : "border-slate-400 text-slate-400 peer-focus:border-violet-500 peer-focus:text-violet-500 peer-hover:border-violet-500 peer-hover:text-violet-500"
              } 
              ${
                access_key.length < 40 || errKeyState || errIpState
                  ? "border-red-500 text-red-500"
                  : "border-green-500 text-green-500 peer-focus:border-green-500 peer-focus:text-green-500"
              }`}
          >
            A
          </div>
          <MdOutlineErrorOutline
            className={`absolute top-5 right-3 duration-300 ${
              keyErrors["access_key"] ||
              errKeyState ||
              errIpState ||
              access_key.length < 40
                ? ""
                : "text-transparent"
            } ${
              errKeyState ||
              errIpState ||
              (0 < access_key.length && access_key.length < 40)
                ? "text-red-500"
                : "text-transparent"
            }`}
          />
          <FaRegCheckCircle
            className={`absolute top-5 right-3 duration-300 ${
              access_key.length >= 40 && !errKeyState && !errIpState
                ? "text-green-500"
                : "text-transparent"
            }`}
          />
          {showAPI ? (
            <FaEye
              className={`absolute top-5 text-slate-400 duration-300
              ${
                (keyErrors["access_key"] && access_key.length) ||
                access_key.length
                  ? "right-10"
                  : "right-3"
              } `}
              onClick={() => setShowAPI(false)}
            />
          ) : (
            <FaEyeSlash
              className={`absolute top-5 text-slate-400 duration-300
              ${
                (keyErrors["access_key"] && access_key.length) ||
                access_key.length
                  ? "right-10"
                  : "right-5"
              }`}
              onClick={() => setShowAPI(true)}
            />
          )}
        </div>
        <h1 className="font-bold text-slate-400 mt-7 select-none">
          SECRET KEY
        </h1>
        <div className="w-full relative transition-all mt-2">
          <input
            type={showAPISecret ? "text" : "password"}
            className={`peer outline-none mt-2 w-full border-[1.5px] rounded-lg pl-10 py-2 duration-300 
              ${
                keyErrors["secret_key"] || secret_key.length
                  ? ""
                  : "border-slate-400 bg-slate-50 hover:border-violet-500 focus:border-violet-500 focus:bg-white"
              } 
              ${
                secret_key.length < 40 || errKeyState || errIpState
                  ? "border-red-500"
                  : "border-green-500 focus:border-green-500 bg-white focus:bg-white"
              }`}
            {...keyRegister("secret_key")}
            onChange={(e) => {
              setSecretKey(e.target.value);
              setErrKeyState(false);
              setErrIpState(false);
              if (access_key.length >= 40) {
                keyErrors["secret_key"] = false;
              }
            }}
            value={secret_key}
          />

          <div
            className={`absolute left-2 top-4 size-[25px] rounded-full border-[1.5px] flex items-center justify-center font-bold text-lg select-none
              ${
                keyErrors["secret_key"] || secret_key.length
                  ? ""
                  : "border-slate-400 text-slate-400 peer-focus:border-violet-500 peer-focus:text-violet-500 peer-hover:border-violet-500 peer-hover:text-violet-500"
              } 
              ${
                secret_key.length < 40 || errKeyState || errIpState
                  ? "border-red-500 text-red-500"
                  : "border-green-500 text-green-500 peer-focus:border-green-500 peer-focus:text-green-500"
              }`}
          >
            S
          </div>
          <MdOutlineErrorOutline
            className={`absolute top-5 right-3 duration-300 ${
              keyErrors["secret_key"] ||
              errKeyState ||
              errIpState ||
              secret_key.length < 40
                ? ""
                : "text-transparent"
            } ${
              errKeyState ||
              errIpState ||
              (0 < secret_key.length && secret_key.length < 40)
                ? "text-red-500"
                : "text-transparent"
            }`}
          />
          <FaRegCheckCircle
            className={`absolute top-5 right-3 duration-300 ${
              secret_key.length >= 40 && !errKeyState && !errIpState
                ? "text-green-500"
                : "text-transparent"
            }`}
          />
          {showAPISecret ? (
            <FaEye
              className={`absolute top-5 text-slate-400 duration-300
              ${
                (keyErrors["secret_key"] && secret_key.length) ||
                secret_key.length
                  ? "right-10"
                  : "right-3"
              } `}
              onClick={() => setShowAPISecret(false)}
            />
          ) : (
            <FaEyeSlash
              className={`absolute top-5 text-slate-400 duration-300
              ${
                (keyErrors["secret_key"] && secret_key.length) ||
                secret_key.length
                  ? "right-10"
                  : "right-5"
              }`}
              onClick={() => setShowAPISecret(true)}
            />
          )}
        </div>
        {errKeyState ? (
          <span className="text-[10px] ml-2 text-red-500 font-bold mt-2 block">
            API KEY를 확인하고 다시 입력해주세요
          </span>
        ) : (
          " "
        )}
        {errIpState ? (
          <span className="text-[10px] ml-2 text-red-500 font-bold mt-2 block">
            IP 주소를 확인하고 다시 입력해주세요
          </span>
        ) : (
          " "
        )}
        {(0 < access_key.length && access_key.length < 40) ||
        (0 < secret_key.length && secret_key.length < 40) ? (
          <span className="text-[10px] ml-2 text-red-500 font-bold mt-2 block">
            40자리 이상 입력해주세요.
          </span>
        ) : (
          " "
        )}
      </div>
    </div>
  );
};

export default StartSecondSettingForm;
