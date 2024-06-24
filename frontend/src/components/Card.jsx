import { AiOutlineDollarCircle } from "react-icons/ai";
import { FiPlusCircle } from "react-icons/fi";
import { FiMinusCircle } from "react-icons/fi";
import { FaWonSign } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useTokenStore from "../utils/token";
import NewLoading from "./NewLoading";
import useResponseStore from "../utils/useResponseStore";

const Card = () => {
  const [exchangeRate, setExchangeRate] = useState("WON");
  const { token } = useTokenStore();
  const canvasRef = useRef(null);
  const {isAPISuccess} = useResponseStore();

  const { data: balance, isLoading, isError, isSuccess, refetch } = useQuery({
    queryKey: ["Balance"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8081/api/v1/dashboard/accounts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log('balance', response)
      return response.data.payload.account || [];
    },
    refetchInterval: 1000,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    enabled: isAPISuccess
  });

  useEffect(() => {
    if (!isLoading && balance) {
      const canvas = canvasRef.current;
      if (canvas) {
        
        const ctx = canvas.getContext("2d");

       
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;

        
        ctx.beginPath();
        ctx.moveTo(50, 150);
        ctx.lineTo(150, 100);
        ctx.lineTo(250, 120);
        ctx.lineTo(350, 80);
        ctx.lineTo(450, 130);
        ctx.stroke();
      }
    }
  }, [isLoading, balance]); 

  if (isLoading || isError) {
    return <NewLoading />;
  } 

  return (
    <div
      className="w-full h-full p-3 relative overflow-hidden rounded-xl border shadow-xl bg-orange-500 
    flex flex-col justify-center items-center font-bold text-3xl text-white"
    >
      <div className="flex flex-col absolute text-white font-bold -bottom-1 right-1 justify-center items-center text-[24px] leading-[32px]">
        <span className="select-none">B</span>
        <span className="select-none">A</span>
        <span className="select-none">L</span>
        <span className="select-none">A</span>
        <span className="select-none">N</span>
        <span className="select-none">C</span>
        <span className="select-none">E</span>
      </div>
      <div className="absolute top-3 left-3 flex items-center transition-all z-10">
        <AiOutlineDollarCircle
          className={`cursor-pointer duration-500 ${
            exchangeRate !== "USD"
              ? "text-orange-400 translate-x-8"
              : "text-white"
          }`}
          onClick={() => setExchangeRate("USD")}
        />
        <div
          className={`size-[26px] peer group duration-500 rounded-full border-2 flex justify-center items-center ml-1 cursor-pointer hover:border-white 
          ${
            exchangeRate === "WON"
              ? "border-white -translate-x-8"
              : "border-orange-400"
          }`}
          onClick={() => setExchangeRate("WON")}
        >
          <FaWonSign
            className={`size-[14px] group-hover:text-white ${
              exchangeRate === "WON" ? "text-white" : "text-orange-400"
            }`}
          />
        </div>
      </div>
      <div className="font-bold absolute -left-1 bottom-10 text-xs -rotate-90 tracking-[4px]">
        <span className="select-none">WEEK</span>
      </div>

      <div className="flex flex-col justify-end items-end">
        <div className="font-bold">
          <span className="tracking-[4px] select-none">
            {exchangeRate === "WON" ? "₩" : "$"}
            {balance}
          </span>
        </div>
        <div className="transition-all absolute bottom-[25%] right-[10%] z-10 duration-300 font-bold flex items-center mt-3 mr-1 rounded-full text-slate-700 px-2 py-1 opacity-50 hover:text-white hover:bg-transparent hover:opacity-100">
          <FiPlusCircle className="size-[20px] mr-2" />
          <span className="text-sm tracking-[2px] select-none">000,000</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute top-[-1%] left-[-3%] opacity-30"
      ></canvas>
    </div>
  );
};

export default Card;
