import BTC from "../assets/coinLogoImages/BTC.png";
import ETH from "../assets/coinLogoImages/ETH.png";
import { RiExchangeBoxFill } from "react-icons/ri";

const Calculater = () => {
  return (
    <div className="w-full h-full border bg-white shadow-lg rounded-lg p-3 flex flex-col relative select-none">
      <div className="w-full h-1/2 flex flex-col">
        <div className="w-full h-[35%] flex items-center justify-between">
          <h1 className="text-xl text-slate-700 font-bold">FROM</h1>
          <div className="border rounded-lg bg-slate-700 px-2 py-1 flex items-center opacity-90">
            <img src={BTC} alt="Coin-Logo" className="size-[20px]" />
            <div className="text-white ml-3 text-lg tracking-widest">BTC</div>
          </div>
        </div>
        <input type="number" className="w-full h-[35%] mt-3 bg-white rounded text-slate-700 outline-none pl-1 border-slate-700 border-[1.5px]" />
      </div>
      <div className="w-full h-1/2 flex flex-col">
        <div className="w-full h-[35%] flex items-center justify-between">
        <h1 className="text-xl text-slate-700 font-bold">TO</h1>
          <div className="border rounded-lg bg-slate-700 px-2 py-1 flex items-center opacity-90">
            <img src={ETH} alt="Coin-Logo" className="size-[20px]" />
            <div className="text-white ml-3 text-lg tracking-widest">ETH</div>
          </div>
        </div>
        <input type="number" className="w-full h-[35%] mt-3 bg-white rounded outline-none text-slate-700 pl-1 border-slate-700 border-[1.5px]" />
      </div>
      <div className="absolute top-[50%] left-[45%]">
      <RiExchangeBoxFill className="size-[30px] rotate-90 text-slate-700" />
      </div>
    </div>
  );
};

export default Calculater;
