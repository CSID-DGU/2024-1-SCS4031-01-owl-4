import { useFormContext } from "react-hook-form";
import useResponseStore from "../utils/useResponseStore";
import { useState } from "react";
import { MdOutlineErrorOutline } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";

const ThirdSettingForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const {
    m_date,
    setMdate,
    n_date,
    setNdate,
    buyingCondition,
    sellingCondition,
    setBuyingCondition,
    setSellingCondition,
    buyingSplit: trading_unit,
    stopLossPoint: stop_loss_point,
    setBuyingSplit,
    setStopLossPoint
  } = useResponseStore();

  return (
    <>
      <div className="w-full h-[35%] shadow-lg rounded-lg border">
        <div className="w-full h-1/4 flex items-center bg-indigo-500 px-3 text-lg rounded-t-lg font-bold py-1 text-white">
          <h1>What is Moving Average?</h1>
        </div>
        <div className="w-full h-[65%] text-sm rounded-b-lg px-3 py-2">
          <p className="">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam officia
            debitis minus rem sint excepturi dolores tempore, reprehenderit
            dolorem ratione adipisci inventore non, quo magni omnis, assumenda
            maiores in aperiam.Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam officia
            debitis minus rem sint excepturi dolores tempore
          </p>
        </div>
      </div>
      <div className="w-full h-[75%] mt-3 shadow-lg rounded-lg border">
        <div className="w-full bg-violet-500 px-3 text-lg rounded-t-lg font-bold py-2 text-white">
          <h1>Manual</h1>
        </div>
        <div className="w-full flex flex-col p-3">
          <h1 className="font-bold text-slate-400">Moving Average</h1>
          <div className="w-full flex justify-between">
            <div className="w-[49%] relative transition-all">
              <input
                type="number"
                className={`peer outline-none mt-2 w-full border-[1.5px] rounded-lg pl-2 py-2 duration-300 
              ${
                errors["m_date"] || String(m_date).length
                  ? ""
                  : "border-slate-400 bg-slate-50 hover:border-violet-500 focus:border-violet-500 focus:bg-white"
              } 
              ${
                !String(m_date).length
                  ? "border-red-500"
                  : "border-green-500 focus:border-green-500 bg-white focus:bg-white"
              }`}
                {...register("m_date")}
                onChange={(e) => setMdate(e.target.value)}
                value={m_date}
              />
              {String(m_date).length ? (
                <span className="absolute top-5 right-10 text-xs text-slate-400 font-bold">
                  MA {m_date}
                </span>
              ) : (
                <span className="absolute top-5 right-[18%] text-red-500 font-bold text-xs">
                  Please Input MA
                </span>
              )}
              <MdOutlineErrorOutline
                className={`absolute top-5 right-3 duration-300 ${
                  errors["m_date"] ? "" : "text-transparent"
                } ${
                  !String(m_date).length ? "text-red-500" : "text-transparent"
                }`}
              />
              <FaRegCheckCircle
                className={`absolute top-5 right-3 duration-300 ${
                  String(m_date).length ? "text-green-500" : "text-transparent"
                }`}
              />
            </div>

            <div className="w-[49%] relative transition-all">
              <input
                type="number"
                className={`peer outline-none mt-2 w-full border-[1.5px] rounded-lg pl-2 py-2 duration-300 
              ${
                errors["n_date"] || String(n_date).length
                  ? ""
                  : "border-slate-400 bg-slate-50 hover:border-violet-500 focus:border-violet-500 focus:bg-white"
              } 
              ${
                !String(n_date).length
                  ? "border-red-500"
                  : "border-green-500 focus:border-green-500 bg-white focus:bg-white"
              }`}
                {...register("n_date")}
                onChange={(e) => setNdate(e.target.value)}
                value={n_date}
              />
              {String(n_date).length ? (
                <span className="absolute top-5 right-10 text-xs text-slate-400 font-bold">
                  MA {n_date}
                </span>
              ) : (
                <span className="absolute top-5 right-[18%] text-red-500 font-bold text-xs">
                  Please Input MA
                </span>
              )}
              <MdOutlineErrorOutline
                className={`absolute top-5 right-3 duration-300 ${
                  errors["n_date"] ? "" : "text-transparent"
                } ${
                  !String(n_date).length ? "text-red-500" : "text-transparent"
                }`}
              />
              <FaRegCheckCircle
                className={`absolute top-5 right-3 duration-300 ${
                  String(n_date).length ? "text-green-500" : "text-transparent"
                }`}
              />
            </div>
          </div>

          <h1 className="font-bold text-slate-400 mt-3">Condition</h1>

          <div className="w-full flex justify-between">
            <div className="w-[49%] relative transition-all">
              <input
                type="number"
                className={`peer outline-none mt-2 w-full border-[1.5px] rounded-lg pl-2 py-2 duration-300 
              ${
                errors["buying_point"] || String(buyingCondition).length
                  ? ""
                  : "border-slate-400 bg-slate-50 hover:border-violet-500 focus:border-violet-500 focus:bg-white"
              } 
              ${
                !String(buyingCondition).length
                  ? "border-red-500"
                  : "border-green-500 focus:border-green-500 bg-white focus:bg-white"
              }`}
                {...register("buying_point")}
                onChange={(e) => setBuyingCondition(e.target.value)}
                value={buyingCondition}
              />
              {String(buyingCondition).length ? (
                <span className="absolute top-5 right-10 text-xs text-slate-400 font-bold">
                  Buying {buyingCondition}%
                </span>
              ) : (
                <span className="absolute top-5 right-[18%] text-red-500 font-bold text-xs">
                  Buying Condition
                </span>
              )}
              <MdOutlineErrorOutline
                className={`absolute top-5 right-3 duration-300 ${
                  errors["buying_point"] ? "" : "text-transparent"
                } ${
                  !String(buyingCondition).length
                    ? "text-red-500"
                    : "text-transparent"
                }`}
              />
              <FaRegCheckCircle
                className={`absolute top-5 right-3 duration-300 ${
                  String(buyingCondition).length
                    ? "text-green-500"
                    : "text-transparent"
                }`}
              />
            </div>

            <div className="w-[49%] relative transition-all">
              <input
                type="number"
                className={`peer outline-none mt-2 w-full border-[1.5px] rounded-lg pl-2 py-2 duration-300 
              ${
                errors["selling_point"] || String(sellingCondition).length
                  ? ""
                  : "border-slate-400 bg-slate-50 hover:border-violet-500 focus:border-violet-500 focus:bg-white"
              } 
              ${
                !String(sellingCondition).length
                  ? "border-red-500"
                  : "border-green-500 focus:border-green-500 bg-white focus:bg-white"
              }`}
                {...register("selling_point")}
                onChange={(e) => setSellingCondition(e.target.value)}
                value={sellingCondition}
              />
              {String(sellingCondition).length ? (
                <span className="absolute top-5 right-10 text-xs text-slate-400 font-bold">
                  Selling {sellingCondition}%
                </span>
              ) : (
                <span className="absolute top-5 right-[18%] text-red-500 font-bold text-xs">
                  Selling Condition
                </span>
              )}
              <MdOutlineErrorOutline
                className={`absolute top-5 right-3 duration-300 ${
                  errors["selling_point"] ? "" : "text-transparent"
                } ${
                  !String(sellingCondition).length
                    ? "text-red-500"
                    : "text-transparent"
                }`}
              />
              <FaRegCheckCircle
                className={`absolute top-5 right-3 duration-300 ${
                  String(sellingCondition).length
                    ? "text-green-500"
                    : "text-transparent"
                }`}
              />
            </div>
          </div>

          <h1 className="font-bold text-slate-400 mt-3">Buying Split</h1>

          <div className="w-2/3 relative transition-all">
            <input
              type="number"
              className={`peer outline-none mt-2 w-full border-[1.5px] rounded-lg pl-2 py-2 duration-300 
              ${
                errors["trading_unit"] || String(trading_unit).length
                  ? ""
                  : "border-slate-400 bg-slate-50 hover:border-violet-500 focus:border-violet-500 focus:bg-white"
              } 
              ${
                !String(trading_unit).length
                  ? "border-red-500"
                  : "border-green-500 focus:border-green-500 bg-white focus:bg-white"
              }`}
              {...register("trading_unit")}
              onChange={(e) => setBuyingSplit(e.target.value)}
              value={trading_unit}
            />
            {String(trading_unit).length ? (
              <span className="absolute top-5 right-10 text-xs text-slate-400 font-bold">
                {trading_unit} Count
              </span>
            ) : (
              <span className="absolute top-5 right-[18%] text-red-500 font-bold text-xs">
                Buying Split Count
              </span>
            )}
            <MdOutlineErrorOutline
              className={`absolute top-5 right-3 duration-300 ${
                errors["trading_unit"] ? "" : "text-transparent"
              } ${
                !String(trading_unit).length
                  ? "text-red-500"
                  : "text-transparent"
              }`}
            />
            <FaRegCheckCircle
              className={`absolute top-5 right-3 duration-300 ${
                String(trading_unit).length
                  ? "text-green-500"
                  : "text-transparent"
              }`}
            />
          </div>

          <h1 className="font-bold text-slate-400 mt-3">Stop Loss Point</h1>
          <div className="w-2/3 relative transition-all">
            <input
              type="number"
              className={`peer outline-none mt-2 w-full border-[1.5px] rounded-lg pl-2 py-2 duration-300 
              ${
                errors["stop_loss_point"] || String(stop_loss_point).length
                  ? ""
                  : "border-slate-400 bg-slate-50 hover:border-violet-500 focus:border-violet-500 focus:bg-white"
              } 
              ${
                !String(stop_loss_point).length
                  ? "border-red-500"
                  : "border-green-500 focus:border-green-500 bg-white focus:bg-white"
              }`}
              {...register("stop_loss_point")}
              onChange={(e) => setStopLossPoint(e.target.value)}
              value={stop_loss_point}
            />
            {String(stop_loss_point).length ? (
              <span className="absolute top-5 right-10 text-xs text-slate-400 font-bold">
                Stop Loss Point {stop_loss_point}%
              </span>
            ) : (
              <span className="absolute top-5 right-[18%] text-red-500 font-bold text-xs">
                Stop Loss Point
              </span>
            )}
            <MdOutlineErrorOutline
              className={`absolute top-5 right-3 duration-300 ${
                errors["stop_loss_point"] ? "" : "text-transparent"
              } ${
                !String(stop_loss_point).length
                  ? "text-red-500"
                  : "text-transparent"
              }`}
            />
            <FaRegCheckCircle
              className={`absolute top-5 right-3 duration-300 ${
                String(stop_loss_point).length
                  ? "text-green-500"
                  : "text-transparent"
              }`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ThirdSettingForm;

{
  /* <div className='w-full text-center font-bold text-xl text-black'>
        <h1>What is average down?</h1>
        <p className='font-normal text-sm text-justify m-3'>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam nesciunt, quasi debitis excepturi ratione laborum fugit delectus? Rerum quis id dolore facilis repellat consectetur, sint accusamus nulla sed totam eum.
        </p>
      </div>

      <div className='border-[0.5px] border-black border-dashed opacity-30'></div>

      <div className='w-full text-center font-bold text-lg text-black mt-5'>
        <h1>Manual</h1>
      </div>

      <div className="relative w-1/2 min-w-[200px] h-10 mt-5">
        <input
          className={`peer w-full h-full px-3 py-2.5 bg-transparent border-t-transparent rounded-[7px] text-sm font-bold outline-none transition-all 
          focus:outline-none focus:border-2 focus:border-purple-500 focus:border-t-transparent focus:bg-white
          disabled:bg-blue-gray-50 disabled:border-0 
          placeholder-shown: border ${getInputErrorStyle('m_date')}`}
          placeholder="" type='number'
          {...register('m_date')}
        />
        <label
          className={`flex w-full h-full ${getLabelErrorStyle('m_date')} select-none text-sm pointer-events-none absolute left-0 font-bold !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] peer-focus:text-purple-500 peer-focus:before:!border-purple-500 peer-focus:after:!border-purple-500`}>
          {errors['m_date'] ? "Moving Average Error" : "First Moving Average"}
        </label>
      </div>
      
      <div className="relative w-1/2 min-w-[200px] h-10 mt-5">
        <input
          className={`peer w-full h-full px-3 py-2.5 bg-transparent border-t-transparent rounded-[7px] text-sm font-bold outline-none transition-all 
          focus:outline-none focus:border-2 focus:border-purple-500 focus:border-t-transparent focus:bg-white
          disabled:bg-blue-gray-50 disabled:border-0 
          placeholder-shown: border ${getInputErrorStyle('n_date')}`}
          placeholder="" type='number'
          {...register('n_date')}
        />
        <label
          className={`flex w-full h-full ${getLabelErrorStyle('n_date')} select-none text-sm pointer-events-none absolute left-0 font-bold !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] peer-focus:text-purple-500 peer-focus:before:!border-purple-500 peer-focus:after:!border-purple-500`}>
          {errors['n_date'] ? "Moving Average Error" : "Second Moving Average"}
        </label>
      </div>

      <div className="relative w-1/2 min-w-[200px] h-10 mt-5">
        <input
          className={`peer w-full h-full px-3 py-2.5 bg-transparent border-t-transparent rounded-[7px] text-sm font-bold outline-none transition-all 
          focus:outline-none focus:border-2 focus:border-purple-500 focus:border-t-transparent focus:bg-white
          disabled:bg-blue-gray-50 disabled:border-0 
          placeholder-shown: border ${getInputErrorStyle('trading_unit')}`}
          placeholder="" type='number'
          {...register('trading_unit')}
        />
        <label
          className={`flex w-full h-full ${getLabelErrorStyle('trading_unit')} select-none text-sm pointer-events-none absolute left-0 font-bold !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] peer-focus:text-purple-500 peer-focus:before:!border-purple-500 peer-focus:after:!border-purple-500`}>
          {errors['trading_unit'] ? "Buying Split Error" : "Buying Split"}
        </label>
      </div>

      <div className="relative w-1/2 min-w-[200px] h-10 mt-5">
        <input
          className={`peer w-full h-full px-3 py-2.5 bg-transparent border-t-transparent rounded-[7px] text-sm font-bold outline-none transition-all 
          focus:outline-none focus:border-2 focus:border-purple-500 focus:border-t-transparent focus:bg-white
          disabled:bg-blue-gray-50 disabled:border-0 
          placeholder-shown: border ${getInputErrorStyle('selling_point')}`}
          placeholder="" type='number'
          {...register('selling_point')}
        />
        <label
          className={`flex w-full h-full ${getLabelErrorStyle('selling_point')} select-none text-sm pointer-events-none absolute left-0 font-bold !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] peer-focus:text-purple-500 peer-focus:before:!border-purple-500 peer-focus:after:!border-purple-500`}>
          {errors['selling_point'] ? "Selling condition Error" : "Selling condition"}
        </label>
      </div>

      <div className="relative w-1/2 min-w-[200px] h-10 mt-5">
        <input
          className={`peer w-full h-full px-3 py-2.5 bg-transparent border-t-transparent rounded-[7px] text-sm font-bold outline-none transition-all 
          focus:outline-none focus:border-2 focus:border-purple-500 focus:border-t-transparent focus:bg-white
          disabled:bg-blue-gray-50 disabled:border-0 
          placeholder-shown: border ${getInputErrorStyle('buying_point')}`}
          placeholder="" type='number'
          {...register('buying_point')}
        />
        <label
          className={`flex w-full h-full ${getLabelErrorStyle('buying_point')} select-none text-sm pointer-events-none absolute left-0 font-bold !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] peer-focus:text-purple-500 peer-focus:before:!border-purple-500 peer-focus:after:!border-purple-500`}>
          {errors['buying_point'] ? "Buying condition Error" : "Buying condition"}
        </label>
      </div>

      <div className="relative w-1/2 min-w-[200px] h-10 mt-5">
        <input
          className={`peer w-full h-full px-3 py-2.5 bg-transparent border-t-transparent rounded-[7px] text-sm font-bold outline-none transition-all 
          focus:outline-none focus:border-2 focus:border-purple-500 focus:border-t-transparent focus:bg-white
          disabled:bg-blue-gray-50 disabled:border-0 
          placeholder-shown: border ${getInputErrorStyle('stop_loss_point')}`}
          placeholder="" type='number'
          {...register('stop_loss_point')}
        />
        <label
          className={`flex w-full h-full ${getLabelErrorStyle('stop_loss_point')} select-none text-sm pointer-events-none absolute left-0 font-bold !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] peer-focus:text-purple-500 peer-focus:before:!border-purple-500 peer-focus:after:!border-purple-500`}>
          {errors['stop_loss_point'] ? "StopLossPoint Error" : "StopLossPoint"}
        </label>
      </div>       */
}
