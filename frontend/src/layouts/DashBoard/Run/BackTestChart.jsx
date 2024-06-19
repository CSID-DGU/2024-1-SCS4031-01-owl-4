import { useEffect, useState } from "react";
import CoinPriceChart from "../../../components/CoinPriceChart";
import TradingProfitRateChart from "../../../components/TradingProfitRateChart";
import { useForm } from "react-hook-form";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import useTokenStore from "../../../utils/token.js";
import useResponseStore from "../../../utils/useResponseStore.js";
import { MdOutlineDescription } from "react-icons/md";
import Modal from "../../../components/Modal.jsx";
import { useNavigate } from "react-router-dom";
import { IoSend } from "react-icons/io5";
import { FaArrowRotateRight } from "react-icons/fa6";
import { BsSendXFill } from "react-icons/bs";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const schema = z.object({
  comment: z
    .string()
    .min(1, { message: "Comment is required" })
    .max(150, { message: "Comment must be less than 200 characters" }),
});

const BackTestChart = ({
  trading,
  performance,
  trading_logs,
  portfolio_id,
  save,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const { token } = useTokenStore();
  const { prevPortfolioId, setPrevPortfolioId, comment, setComment } =
    useResponseStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      console.log(data);
      const response = await axios.post(
        "http://localhost:8081/api/v1/backtesting/save",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    },
    onSuccess: () => {
      setPrevPortfolioId(portfolio_id);
      setOpen(true);
      setComment("");
    },
  });

  useEffect(() => {
    let timer;
    if (open) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [open]);

  useEffect(() => {
    if (countdown === 0) {
      setOpen(false);
    }
  }, [countdown]);

  const onSubmit = (data) => {
    mutation.mutate({ ...data, portfolio_id });
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-1/2 px-5">
        <div className="h-full rounded-xl shadow-xl border relative">
          <CoinPriceChart tradingLogs={trading_logs} />
        </div>
      </div>
      <div className="w-full h-1/2 flex">
        <div className="w-3/5 h-full pl-5 pt-5 pb-1 pr-2">
          <div className="h-full rounded-xl shadow-xl border relative p-4">
            <TradingProfitRateChart tradingLogs={trading_logs} />
          </div>
        </div>
        <div className="w-2/5 flex justify-center items-center pt-5 pb-1 pr-5 pl-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full h-full border rounded-xl shadow-xl p-3 flex flex-col relative"
          >
            <h1 className="font-bold text-2xl text-slate-400 ml-4 mt-3 select-none">
              Comment
            </h1>

            <div className="relative w-full h-3/4 my-4 transition-all">
              <textarea
                className={`peer w-full h-full outline-none p-3 rounded-lg duration-300 border-[1.5px]
              ${
                errors["comment"] || comment.length
                  ? ""
                  : "border-slate-400 bg-slate-50 hover:border-violet-500 focus:border-violet-500 focus:bg-white"
              } 
              ${
                !comment.length
                  ? "border-red-500"
                  : "border-green-500 focus:border-green-500 bg-white focus:bg-white"
              }`}
                {...register("comment")}
                onChange={(e) => setComment(e.target.value)}
                maxLength={150}
                value={comment}
                disabled={
                  prevPortfolioId === portfolio_id || save ? true : false
                }
              />

              <div className="absolute bottom-3 right-5 text-slate-400 select-none">
                {comment.length}/150
              </div>
              {comment.length ? (
                ""
              ) : (
                <MdOutlineDescription
                  className={`absolute top-[45%] left-[45%] size-[30px] peer-focus:invisible ${
                    errors["comment"] ? "text-red-500" : "text-slate-400"
                  }`}
                />
              )}
            </div>
            <div className="flex w-full justify-between">
              <button
                type="button"
                onClick={() => navigate("../strategy")}
                className="group flex items-center justify-start w-[20%] h-10 bg-red-500 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
              >
                <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                  <FaArrowRotateRight className="text-white size-[20px] animate-spin" />
                </div>
                <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  Restart
                </div>
              </button>
              <button
                className={`rounded-lg relative top-0 left-0 w-[50%] h-10 flex items-center border  ${
                  prevPortfolioId === portfolio_id || save
                    ? "border-slate-200 bg-slate-200 group hover:bg-slate-200 active:bg-slate-200 active:border-slate-200"
                    : "border-green-500 bg-green-500 group hover:bg-green-500 active:bg-green-500 active:border-green-500 cursor-pointer"
                }`}
                disabled={
                  prevPortfolioId === portfolio_id || save ? true : false
                }
                type="submit"
              >
                <span
                  className={`font-semibold ml-8 select-none  ${
                    prevPortfolioId === portfolio_id || save
                      ? "text-slate-400"
                      : "text-white transform group-hover:translate-x-20 transition-all duration-300 group-hover:text-transparent"
                  }`}
                >
                  {prevPortfolioId === portfolio_id || save
                    ? "Submitted"
                    : "Submit"}
                </span>
                <span
                  className={`absolute right-0 h-full w-10 rounded-lg flex items-center justify-center ${
                    prevPortfolioId === portfolio_id || save
                      ? "bg-slate-300"
                      : "bg-green-500 transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300"
                  }`}
                >
                  {prevPortfolioId === portfolio_id || save ? (
                    <BsSendXFill className="text-slate-400" />
                  ) : (
                    <IoSend className="text-white" />
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="w-[350px] h-[150px] relative flex flex-col justify-center items-center p-5">
          <h1 className="font-bold text-xl text-green-500 select-none">
            Submit Successful
          </h1>
          <div className="flex items-center cursor-pointer mt-3 relative">
            <span className="select-none" onClick={() => setOpen(false)}>Continue</span>
            <MdOutlineKeyboardDoubleArrowRight className="animate-ping ml-3 text-green-500" />
          </div>
          <p className="text-xs absolute bottom-0 right-0 text-slate-400 mt-2">
            Closes in <span className="font-bold text-slate-600 select-none">{countdown}</span> seconds
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default BackTestChart;

