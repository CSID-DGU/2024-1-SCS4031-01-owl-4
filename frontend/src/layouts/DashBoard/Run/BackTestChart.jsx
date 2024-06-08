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
import { IoCloseCircleSharp } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";

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
            <h1 className="font-bold text-2xl text-slate-400 ml-4 mt-3">
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

              <div className="absolute bottom-3 right-5 text-slate-400">
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

            <button
              disabled={prevPortfolioId === portfolio_id || save ? true : false}
              type="submit"
              className="w-full mt-auto bg-blue-500 text-white py-2 rounded"
            >
              {prevPortfolioId === portfolio_id || save
                ? "Submitted"
                : "Submit"}
            </button>
          </form>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="w-[450px] h-[250px] flex flex-col justify-center items-center">
          <h1 className="font-bold text-xl">Submit Successful</h1>
          <div className="w-2/3 flex justify-between mt-10">
            <button
              type="button"
              className="text-center w-32 rounded-2xl h-12 relative font-sans text-black text-xl font-semibold group bg-slate-200 flex items-center justify-center"
              onClick={() => setOpen(false)}
            >
              <div className="bg-red-500 rounded-xl h-10 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[120px] z-10 duration-500 text-white">
                <FaArrowLeft />
              </div>
              <p className="translate-x-2 text-lg">Back</p>
            </button>
            <button
              type="button"
              className="text-center w-32 rounded-2xl h-12 relative font-sans text-black text-xl font-semibold group bg-slate-200 flex items-center justify-start"
              onClick={() => navigate("../portfolio")}
            >
              <div className="bg-green-500 rounded-xl h-10 w-1/4 flex items-center justify-center absolute rotate-180 right-1 top-[4px] group-hover:w-[120px] z-10 duration-500 text-white">
                <FaArrowLeft />
              </div>
              <p className="translate-x-2 text-lg ml-1">Portfolio</p>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BackTestChart;
