import { FaCheck } from "react-icons/fa";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "antd";
import moment from "moment";
import Modal from "./Modal.jsx";
import useTokenStore from "../utils/token.js";
import { useState } from "react";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineErrorOutline } from "react-icons/md";
import { FaWonSign } from "react-icons/fa6";
import useKeyStore from "../utils/useKeyStore.js";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { FaArrowsSpin } from "react-icons/fa6";
const { RangePicker } = DatePicker;
function formatNumberWithUnits(num, exchangeRate) {
  const absNum = Math.abs(num);

  if (exchangeRate === "usd") {
    if (absNum >= 1.0e12) {
      // Trillions
      return (num / 1.0e12).toFixed(2) + "T";
    } else if (absNum >= 1.0e9) {
      // Billions
      return (num / 1.0e9).toFixed(2) + "B";
    } else if (absNum >= 1.0e6) {
      // Millions
      return (num / 1.0e6).toFixed(2) + "M";
    } else {
      return num.toString(); // Less than thousands
    }
  } else {
    if (absNum >= 1.0e16) {
      // Quadrillions (조)
      return (num / 1.0e16).toFixed(2) + "조";
    } else if (absNum >= 1.0e12) {
      // Trillions (억)
      return (num / 1.0e12).toFixed(2) + "억";
    } else if (absNum >= 1.0e8) {
      // Billions (억)
      return (num / 1.0e8).toFixed(2) + "억";
    } else if (absNum >= 1.0e4) {
      // Ten thousands (만)
      return (num / 1.0e4).toFixed(2) + "만원";
    } else if (absNum >= 1.0e3) {
      // Thousands (천)
      return (num / 1.0e3).toFixed(2) + "천원";
    } else {
      return num.toString() + "원"; // Less than thousands
    }
  }
}

const schema = z.object({
  initial_capital: z.preprocess(
    (value) => parseFloat(value),
    z.number().positive({ message: "Funds must be a positive number" })
  ),
  start_date: z
    .string()
    .nonempty({ message: "Start date is required" })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Start date must be a valid date",
    }),
  end_date: z
    .string()
    .nonempty({ message: "End date is required" })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "End date must be a valid date",
    }),
  access_key: z.string().nonempty({ message: "Access Key is required" }),
  secret_key: z.string().nonempty({ message: "Secret Key is required" }),
});

const AgreeAutoPurchase = () => {
  const [open, setOpen] = useState(false);
  const [fund, setFund] = useState(0);
  const [exchangeRate, setExchangeRate] = useState("usd");
  const [showAPI, setShowAPI] = useState(false);
  const [showAPISecret, setShowAPISecret] = useState(false);
  const [access_key, setAccessKey] = useState("");
  const [secret_key, setSecretKey] = useState("");
  const { token } = useTokenStore();
  const { has_key } = useKeyStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      console.log(data);
      const response = await axios.post("http://localhost:8081/api/v1/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
    },
    onSuccess: () => {},
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  console.log(has_key);
  return (
    <div className="w-full h-full flex">
      <div className="w-1/2 border-r-2">
        <span className="font-bold text-xl">Agreement</span>
        <div className="border-2 border-slate-200 border-dashed mt-3 mr-3"></div>
        <div className="w-full flex flex-col justify-center items-center mt-3 pr-2">
          <div className="w-full flex flex-col">
            <div className="flex items-center p-1 relative">
              <div
                className={`size-[20px] rounded-full cursor-pointer flex justify-center items-center p-1 bg-violet-600 `}
              >
                <FaCheck className="text-white" />
              </div>
              <h1 className="font-bold ml-3 text-lg select-none">전체 동의</h1>
              <div className="flex flex-col absolute top-0 right-8 bg-slate-50">
                <span className="text-xs text-slate-400">
                  자동 구매를 진행하기 위해
                </span>
                <span className="text-xs text-slate-400">
                  아래의 약관에 모두 동의해야 합니다.
                </span>
              </div>
            </div>
          </div>

          <div className="w-full mt-3 cursor-pointer relative rounded-lg border border-slate-400 p-3 font-bold text-sm flex items-center group hover:border hover:border-violet-400">
            <div
              className={`size-[15px] rounded-full cursor-pointer flex justify-center items-center p-1 bg-violet-600`}
            >
              <FaCheck className="text-white" />
            </div>
            <span className={`ml-3 group-hover:text-violet-400`}>
              BAMOWL 서비스 이용에 대한 약관동의
            </span>
            <FaRegQuestionCircle className="size-[15px] absolute z-10 top-[33%] right-[4%] text-slate-400" />
          </div>
          <div className="w-full mt-3 cursor-pointer relative rounded-lg border border-slate-400 p-3 font-bold text-sm flex items-center group hover:border hover:border-violet-400">
            <div
              className={`size-[15px] rounded-full cursor-pointer flex justify-center items-center p-1 bg-violet-600`}
            >
              <FaCheck className="text-white" />
            </div>
            <span className={`ml-3 group-hover:text-violet-400`}>
              개인정보 수집 및 이용에 대한 약관동의
            </span>
            <FaRegQuestionCircle className="size-[15px] absolute z-10 top-[33%] right-[4%] text-slate-400" />
          </div>
          <div className="w-full mt-3 cursor-pointer relative rounded-lg border border-slate-400 p-3 font-bold text-sm flex items-center group hover:border hover:border-violet-400">
            <div
              className={`size-[15px] rounded-full cursor-pointer flex justify-center items-center p-1 bg-violet-600`}
            >
              <FaCheck className="text-white" />
            </div>
            <span className={`ml-3 group-hover:text-violet-400`}>
              개인정보 취급 및 위탁에 대한 약관동의
            </span>
            <FaRegQuestionCircle className="size-[15px] absolute z-10 top-[33%] right-[4%] text-slate-400" />
          </div>
        </div>
      </div>

      <div className="w-1/2 flex flex-col">
        <div className="w-full h-1/2 pl-3 relative">
          <div className="flex w-full justify-between">
            <span className="font-bold text-xl">Purchase</span>
            <div className="w-full h-5 flex items-center justify-end">
              <button
                className="w-2/3 cursor-pointer relative shadow-lg border inline-flex items-center justify-start py-3 pl-4 pr-8 overflow-hidden font-semibold text-violet-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:text-gray-200 dark:shadow-none group"
                onClick={() => setOpen(true)}
                disabled={has_key === "true" ? true : false}
              >
                <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-violet-600 group-hover:h-full"></span>
                <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                  <FaRegArrowAltCircleRight />
                </span>
                <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                  <FaRegArrowAltCircleRight className="text-white" />
                </span>
                <span className="relative text-sm w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white dark:group-hover:text-gray-200">
                  UPbit API 키 등록
                </span>
              </button>
            </div>
          </div>
          <div className="border-2 border-slate-200 border-dashed mt-3 mr-3"></div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full h-full flex flex-col relative"
          >
            <div className="w-full mt-1 py-2 flex justify-start">
              <button
                className={`flex justify-center py-1 px-2 items-center rounded-xl border-[1.5px] ${
                  exchangeRate === "usd"
                    ? "bg-violet-600 text-white font-bold"
                    : "border-slate-400 text-slate-400 hover:border-violet-400 hover:text-violet-400"
                }`}
                onClick={() => setExchangeRate("usd")}
              >
                <AiOutlineDollarCircle className="size-[20px]" />
                <span className="ml-2 text-xs">USD</span>
              </button>
              <button
                className={`flex justify-center py-1 px-2 items-center rounded-xl border-[1.5px] ml-2 ${
                  exchangeRate === "krw"
                    ? "bg-violet-600 text-white font-bold"
                    : "border-slate-400 text-slate-400 hover:border-violet-400 hover:text-violet-400"
                }`}
                onClick={() => setExchangeRate("krw")}
              >
                <div
                  className={`flex justify-center items-center rounded-full p-1 border-[1.5px] ${
                    exchangeRate === "krw" ? "border-white" : "border-slate-400"
                  }`}
                >
                  <FaWonSign className="size-[10px]" />
                </div>
                <span className="ml-2 text-xs">KRW</span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="w-1/5 text-center font-bold text-slate-400">
                Fund
              </h1>
              <div className="w-4/5 relative transition-all">
                <input
                  type="number"
                  className={`peer outline-none mt-2 w-full border-[1.5px] rounded-lg pl-2 py-2 duration-300 
              ${
                errors["initial_capital"] || String(fund).length
                  ? ""
                  : "border-slate-400 bg-slate-50 hover:border-violet-500 focus:border-violet-500 focus:bg-white"
              } 
              ${
                !String(fund).length
                  ? "border-red-500"
                  : "border-green-500 focus:border-green-500 bg-white focus:bg-white"
              }`}
                  {...register("initial_capital")}
                  onChange={(e) => setFund(e.target.value)}
                  value={fund}
                />
                {String(fund).length ? (
                  <span className="absolute top-5 right-10 text-xs text-slate-400 font-bold">
                    {formatNumberWithUnits(fund, exchangeRate)}
                  </span>
                ) : (
                  <span className="absolute top-5 right-[30%] text-red-500 font-bold text-xs">
                    Please Input Your Cash
                  </span>
                )}
                <MdOutlineErrorOutline
                  className={`absolute top-5 right-3 duration-300 ${
                    errors["initial_capital"] ? "" : "text-transparent"
                  } ${
                    !String(fund).length ? "text-red-500" : "text-transparent"
                  }`}
                />
                <FaRegCheckCircle
                  className={`absolute top-5 right-3 duration-300 ${
                    String(fund).length ? "text-green-500" : "text-transparent"
                  }`}
                />
              </div>
            </div>
            <Controller
      name="dateRange"
      control={control}
      render={({ field }) => (
        <RangePicker
          showTime
          className="h-10 mt-5 bg-transparent border-[1.5px] border-slate-400 font-bold text-black "
          value={field.value ? [field.value[0], field.value[1]] : []}
          disabledDate={(current) =>
            current && current < moment().startOf("day")
          }
          disabledTime={(current) => {
            if (current && current.isSame(moment(), 'day')) {
              return {
                disabledHours: () => Array.from({length: 24}, (_, i) => i).slice(0, moment().hour()),
                disabledMinutes: () => Array.from({length: 60}, (_, i) => i).slice(0, moment().minute()),
                disabledSeconds: () => Array.from({length: 60}, (_, i) => i).slice(0, moment().second()),
              };
            }
            return {};
          }}
          onChange={(dates) => {
            if (dates) {
              const startDate = dates[0].toISOString().split(".")[0];
              const endDate = dates[1].toISOString().split(".")[0];
              setValue("start_date", startDate);
              setValue("end_date", endDate);
            } else {
              setValue("start_date", "");
              setValue("end_date", "");
            }
            field.onChange(dates);
          }}
        />
      )}
    />
          </form>
          <div className="flex items-center mt-10 justify-between">
            <button className="rounded-lg relative w-[63%] h-10 cursor-pointer flex items-center border border-green-500 bg-green-500 group hover:bg-green-500 active:bg-green-500 active:border-green-500">
              <span className="text-white font-semibold ml-8 transform group-hover:translate-x-20 transition-all duration-300 group-hover:text-transparent">
                Auto Purchase Run
              </span>
              <span className="absolute right-0 h-full w-10 rounded-lg bg-green-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
                <FaArrowsSpin className="text-white animate-spin" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => console.log()}
              className="group flex items-center justify-start w-10 h-10 bg-red-500 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
            >
              <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                <FaTrash className="text-white size-[20px]" />
              </div>
              <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                Cancel
              </div>
            </button>
          </div>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="w-[500px] h-[275px]">
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
          <h1 className="font-bold text-slate-400 mt-7 select-none">
            SECRET KEY
          </h1>
          <div className="w-full relative transition-all mt-2">
            <input
              type={showAPISecret ? "text" : "password"}
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
          <div className="w-full flex justify-center mt-8">
            <button
              className="rounded-lg relative w-[30%] h-10 mr-3 cursor-pointer flex items-center border border-red-500 bg-red-500 group hover:bg-red-500 active:bg-red-500 active:border-red-500"
              onClick={() => setOpen(false)}
            >
              <span className="text-white font-semibold ml-8 transform group-hover:translate-x-20 transition-all duration-300 group-hover:text-transparent">
                Back
              </span>
              <span className="absolute right-0 h-full w-10 rounded-lg bg-red-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
                <FaArrowLeft className="text-white" />
              </span>
            </button>
            <button
              className="rounded-lg relative w-[30%] h-10 ml-3 cursor-pointer flex items-center border border-green-500 bg-green-500 group hover:bg-green-500 active:bg-green-500 active:border-green-500"
              onClick={() => setOpen(false)}
            >
              <span className="text-white font-semibold ml-8 transform group-hover:translate-x-20 transition-all duration-300 group-hover:text-transparent">
                Send
              </span>
              <span className="absolute right-0 h-full w-10 rounded-lg bg-green-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
                <IoSend className="text-white" />
              </span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AgreeAutoPurchase;

