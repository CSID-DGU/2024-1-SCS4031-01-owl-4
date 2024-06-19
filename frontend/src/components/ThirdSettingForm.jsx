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
        <div className="w-full h-[19.5%] bg-indigo-500 px-3 text-lg rounded-t-lg font-bold py-1 text-white">
          <h1>What is Moving Average (이동평균선) ?</h1>
        </div>
        <div className="w-full h-3/4 text-sm rounded-b-lg px-3 py-2">
          <p className="font-bold text-black leading-5">
          이동평균선은 일정 기간 동안의 평균 가격을 산출하여, 현재 가격이 과거 평균과 비교하여 어느 정도 위치에 있는지를 보여줍니다. 
          이동평균선은 단기 및 장기 추세를 파악하는 데 유용하며, 매수와 매도의 신호로 활용됩니다.
          <div>Stop Loss Point는 손절매 지점입니다. 
          이는 손실을 제한하기 위해 설정하는 가격 수준으로, 자산 가격이 이 지점에 도달하면 자동으로 매도하여 손실을 방지합니다.</div>
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