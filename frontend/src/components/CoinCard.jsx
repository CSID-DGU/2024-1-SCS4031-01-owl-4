import { getImageURL } from "../utils/image-utils";
import { BsArrowRepeat } from "react-icons/bs";
import { IoPricetagsSharp } from "react-icons/io5";
import { PiSealPercentFill } from "react-icons/pi";
import { AiFillDollarCircle } from "react-icons/ai";
import { useState } from "react";

const CoinCard = ({ coin }) => {
    const formattedBalance = parseFloat(coin.balance).toFixed(2);
  const formattedPrice = parseFloat(coin.price).toFixed(1);
    const [choose, setChoose] = useState("balance");

  return (
    <div className={`w-full h-full bg-slate-700 relative flex flex-col flex-shrink-0`}>
      <img
        src={getImageURL(coin.market_name.split("-")[1])}
        alt="CoinLogo"
        className="size-[100px] opacity-20 top-5 right-8 absolute select-none"
      />

      <div className="w-full flex justify-end items-center mt-1">
        <div className="flex justify-evenly items-center w-[50%] mr-2">
          <div
            className="flex justify-center items-center relative group cursor-pointer"
            onClick={() => setChoose("coin")}
          >
            <BsArrowRepeat
              className={`size-[25px] text-white animate-spin select-none ${
                choose === "coin" ? "opacity-100" : "opacity-50"
              }`}
            />
            <span
              className={`absolute top-[10%] left-[35%] text-[12px] text-white font-bold select-none ${
                choose === "coin" ? "opacity-100" : "opacity-50"
              }`}
            >
              C
            </span>
          </div>
          <button
            className={`text-white  ${
              choose === "price" ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => setChoose("price")}
          >
            <IoPricetagsSharp className="size-[20px]" />
          </button>
          <button
            className={`text-white  ${
              choose === "rate" ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => setChoose("rate")}
          >
            <PiSealPercentFill className="size-[20px]" />
          </button>
          <button
            className={`text-white  ${
              choose === "balance" ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => setChoose("balance")}
          >
            <AiFillDollarCircle className="size-[20px]" />
          </button>
        </div>
      </div>

      <div className="flex h-[23%] justify-start items-center">
        <h1 className="text-white font-bold text-3xl ml-8 select-none">
          {coin.market_name.split("-")[1]}
        </h1>
      </div>
      <div className="flex h-[20%] justify-center items-center">
        <h1 className="text-white font-bold text-2xl tracking-widest select-none">
          {choose === "coin" ? coin.coin_count :""}
          {choose === "price" ? formattedPrice :""}
          {choose === "rate" ? coin.rate :""}
          {choose === "balance" ? "₩"+formattedBalance :""}
        </h1>
      </div>
    </div>
  );
};

export default CoinCard;
