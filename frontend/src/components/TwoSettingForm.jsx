import { useFormContext, Controller } from "react-hook-form";
import useResponseStore from "../utils/useResponseStore";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { FaWonSign } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { MdOutlineErrorOutline } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import { DatePicker } from "antd";
import moment from 'moment';

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

const TwoSettingForm = () => {
  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext();
  const { fund, setFund, candle, setCandle } = useResponseStore();
  const [exchangeRate, setExchangeRate] = useState("usd");

   useEffect(() => {
    setValue("candle_name", "days");
  }, [setValue]);

  return (
    <>
      <div className="w-full h-[25%] shadow-lg rounded-lg border">
        <div className="w-full h-1/4 bg-indigo-500 px-3 text-lg rounded-t-lg font-bold py-1 text-white">
          <h1>What is Average Down?</h1>
        </div>
        <div className="w-full h-3/4 text-sm rounded-b-lg px-3 py-2">
          <p className="">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam officia
            debitis minus rem sint excepturi dolores tempore, reprehenderit
            dolorem ratione adipisci inventore non, quo magni omnis, assumenda
            maiores in aperiam.
          </p>
        </div>
      </div>
      <div className="w-full h-[75%] mt-3 shadow-lg rounded-lg border">
        <div className="w-full bg-violet-500 px-3 text-lg rounded-t-lg font-bold py-2 text-white">
          <h1>Manual</h1>
        </div>
        <div className="w-full flex flex-col p-3">
          <h1 className="font-bold text-slate-400">Fund</h1>

          <div className="w-full mt-1 py-2 flex">
            <button
              className={`flex justify-center py-1 px-2 items-center rounded-xl border-[1.5px] ${
                exchangeRate === "usd"
                  ? "bg-indigo-500 text-white font-bold"
                  : "border-slate-400 text-slate-400 hover:border-violet-400 hover:text-violet-400"
              }`}
              onClick={() => setExchangeRate("usd")}
            >
              <AiOutlineDollarCircle className="size-[20px]" />
              <span className="ml-2">USD</span>
            </button>
            <button
              className={`flex justify-center py-1 px-2 items-center rounded-xl border-[1.5px] ml-2 ${
                exchangeRate === "krw"
                  ? "bg-indigo-500 text-white font-bold"
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
              <span className="ml-2">KRW</span>
            </button>
          </div>
          <div className="flex">

          </div>
          <div className="w-2/3 relative transition-all">
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
              } ${!String(fund).length ? "text-red-500" : "text-transparent"}`}
            />
            <FaRegCheckCircle
              className={`absolute top-5 right-3 duration-300 ${
                String(fund).length ? "text-green-500" : "text-transparent"
              }`}
            />
          </div>

          <h1 className="font-bold text-slate-400 mt-3">Candles</h1>

          <div className="w-full mt-1 py-2 flex">
            <button
              className={`flex justify-center py-1 px-3 items-center rounded-xl border-[1.5px] ${
                candle === "minutes1"
                  ? " bg-teal-500 text-white font-bold"
                  : "border-slate-400 text-slate-400 hover:border-violet-400 hover:text-violet-400"
              }`}
              onClick={() => {
                setCandle("minutes1")
                setValue("candle_name","minutes1")
              }}
            >
              <span className="text-sm">1M</span>
            </button>
            <button
              className={`flex justify-center py-1 px-3 ml-2 items-center rounded-xl border-[1.5px] ${
                candle === "minutes3"
                  ? "bg-teal-500 text-white font-bold"
                  : "border-slate-400 text-slate-400 hover:border-violet-400 hover:text-violet-400"
              }`}
              onClick={() => {
                setCandle("minutes3")
                setValue("candle_name","minutes3")
              }}
            >
              <span className="text-sm">3M</span>
            </button>
            <button
              className={`flex justify-center py-1 px-3 ml-2 items-center rounded-xl border-[1.5px] ${
                candle === "minutes5"
                  ? "bg-teal-500 text-white font-bold"
                  : "border-slate-400 text-slate-400 hover:border-violet-400 hover:text-violet-400"
              }`}
              onClick={() => {
                setCandle("minutes5")
                setValue("candle_name","minutes5")
              }}
            >
              <span className="text-sm">5M</span>
            </button>
            <button
              className={`flex justify-center py-1 px-3 ml-2 items-center rounded-xl border-[1.5px] ${
                candle === "minutes10"
                  ? "bg-teal-500 text-white font-bold"
                  : "border-slate-400 text-slate-400 hover:border-violet-400 hover:text-violet-400"
              }`}
              onClick={() => {
                setCandle("minutes10")
                setValue("candle_name","minutes10")
              }}
            >
              <span className="text-sm">10M</span>
            </button>
            <button
              className={`flex justify-center py-1 px-3 ml-2 items-center rounded-xl border-[1.5px] ${
                candle === "minutes15"
                  ? "bg-teal-500 text-white font-bold"
                  : "border-slate-400 text-slate-400 hover:border-violet-400 hover:text-violet-400"
              }`}
              onClick={() => {
                setCandle("minutes15")
                setValue("candle_name","minutes15")
              }}
            >
              <span className="text-sm">15M</span>
            </button>
            <button
              className={`flex justify-center py-1 px-3 ml-2 items-center rounded-xl border-[1.5px] ${
                candle === "minutes30"
                  ? "bg-teal-500 text-white font-bold"
                  : "border-slate-400 text-slate-400 hover:border-violet-400 hover:text-violet-400"
              }`}
              onClick={() => {
                setCandle("minutes30")
                setValue("candle_name","minutes30")
              }}
            >
              <span className="text-sm">30M</span>
            </button>
          </div>

          <div className="w-full mt-1 py-2 flex">
            <button
              className={`flex justify-center py-1 px-3 items-center rounded-xl border-[1.5px] ${
                candle === "minutes60"
                  ? "bg-cyan-500 text-white font-bold"
                  : "border-slate-400 text-slate-400 hover:border-violet-400 hover:text-violet-400"
              }`}
              onClick={() => {
                setCandle("minutes60")
                setValue("candle_name","minutes60")
              }}
            >
              <span className="text-sm">1H</span>
            </button>
            <button
              className={`flex justify-center py-1 px-3 ml-2 items-center rounded-xl border-[1.5px] ${
                candle === "minutes240"
                  ? "bg-cyan-500 text-white font-bold"
                  : "border-slate-400 text-slate-400 hover:border-violet-400 hover:text-violet-400"
              }`}
              onClick={() => {
                setCandle("minutes240")
                setValue("candle_name","minutes240")
              }}
            >
              <span className="text-sm">4H</span>
            </button>
          </div>

          <div className="w-full mt-1 py-2 flex">
            <button
              className={`flex justify-center py-1 px-3 items-center rounded-xl border-[1.5px] ${
                candle === "days"
                  ? " bg-emerald-500 text-white font-bold"
                  : "border-slate-400 text-slate-400 hover:border-violet-400 hover:text-violet-400"
              }`}
              onClick={() => {
                setCandle("days")
                setValue("candle_name","days")
              }}
            >
              <span className="text-sm">1 DAY</span>
            </button>
            <button
              className={`flex justify-center py-1 px-3 ml-2 items-center rounded-xl border-[1.5px] ${
                candle === "weeks"
                  ? "bg-emerald-500 text-white font-bold"
                  : "border-slate-400 text-slate-400 hover:border-violet-400 hover:text-violet-400"
              }`}
              onClick={() => {
                setCandle("weeks")
                setValue("candle_name","weeks")
              }}
            >
              <span className="text-sm">1 Week</span>
            </button>
            <button
              className={`flex justify-center py-1 px-3 ml-2 items-center rounded-xl border-[1.5px] ${
                candle === "months"
                  ? "bg-emerald-500 text-white font-bold"
                  : "border-slate-400 text-slate-400 hover:border-violet-400 hover:text-violet-400"
              }`}
              onClick={() => {
                setCandle("months")
                setValue("candle_name","months")
              }}
            >
              <span className="text-sm">1 Month</span>
            </button>
          </div>

          <Controller
            name="dateRange"
            control={control}
            render={({ field }) => (
              <RangePicker
                showTime
                className="h-10 mt-5 bg-transparent border-[1.5px] border-slate-400 font-bold text-black"
                value={field.value ? [field.value[0], field.value[1]] : []}
                disabledDate={(current) =>
                  current &&
                  (current > moment() || current < moment("2019-01-01"))
                }
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
        </div>
      </div>
    </>
  );
};

export default TwoSettingForm;
