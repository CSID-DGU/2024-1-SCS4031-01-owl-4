import { GiWallet } from "react-icons/gi";
import { FaArrowAltCircleRight } from "react-icons/fa";
import axios from "axios";
import useTokenStore from "../utils/token";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CoinList from "./CoinList";
import NewLoading from "./NewLoading";
import CoinCard from "./CoinCard";

const Coins = () => {
  const { token } = useTokenStore();
  const [top5ByBalance, setTop5ByBalance] = useState([]);
  const [top4ByRate, setTop4ByRate] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: coins, isLoading } = useQuery({
    queryKey: ["userCoins"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8081/api/v1/dashboard/coins/possession`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.payload;
    },
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (coins && coins.length > 0) {
      // balance 기준 상위 5개
      const sortedByBalance = coins
        .slice()
        .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance))
        .slice(0, 4);
      setTop5ByBalance(sortedByBalance);

      // rate 절댓값 기준 상위 4개
      const sortedByRate = coins
        .slice()
        .sort((a, b) => Math.abs(b.rate) - Math.abs(a.rate))
        .slice(0, 4);
      setTop4ByRate(sortedByRate);
    }
  }, [coins]);

  if (isLoading) {
    return <NewLoading />;
  }

  // 이전 슬라이드로 이동
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? top5ByBalance.length - 1 : prevIndex - 1
    );
  };

  // 다음 슬라이드로 이동
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === top5ByBalance.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border shadow-lg rounded-xl relative">
      <div className="h-[15%] font-bold text-xl bg-yellow-400 relative rounded-t-xl">
        <GiWallet className="text-white size-[80px] border-2 p-2 border-white rounded-full absolute -bottom-3 -right-3" />
      </div>
      <div
        className="flex cursor-pointer justify-center items-center absolute z-10 top-[26%] -right-2 bg-slate-700 rounded-full p-1 border-white opacity-50 border hover:opacity-100"
        onClick={nextSlide}
      >
        <FaArrowAltCircleRight className="size-[30px] text-white" />
      </div>
      <div
        className="flex cursor-pointer justify-center items-center absolute z-10 rotate-180 top-[26%] -left-2 bg-slate-700 rounded-full p-1 border-white opacity-50 border hover:opacity-100"
        onClick={prevSlide}
      >
        <FaArrowAltCircleRight className="size-[30px] text-white" />
      </div>
      <div className="h-[36%] w-full rounded-3xl shadow-xl absolute top-[12%] left-0 border-2 border-white overflow-hidden">
        <div
          className="flex h-full transition-transform duration-300"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {top5ByBalance.map((coin, index) => (
            <CoinCard key={index} coin={coin} coinIndex = {index} length = {top5ByBalance.length} />
          ))}
        </div>
      </div>
      <div className="h-[33%] border-0"></div>
      <div className="h-[53%] rounded-b-xl p-3">
        <div className="w-full flex justify-between items-center">
          <h1 className="font-bold select-none">TOP RATE</h1>
          <h1 className="font-bold rounded-full cursor-pointer select-none text-sm">
            See More →
          </h1>
        </div>
        <div className="w-full h-[83%] mt-2">
          {top4ByRate.map((coin, index) => (
            <CoinList key={index} coin={coin} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Coins;
