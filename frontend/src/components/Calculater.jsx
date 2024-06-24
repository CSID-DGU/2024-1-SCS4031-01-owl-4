import BTC from "../assets/coinLogoImages/BTC.png";
import ETH from "../assets/coinLogoImages/ETH.png";
import { RiExchangeBoxFill } from "react-icons/ri";
import Modal from "../components/Modal";
import { useEffect, useState } from "react";
import NewLoading from "./NewLoading";
import { getImageURL } from "../utils/image-utils";
import useResponseStore from "../utils/useResponseStore";

const Calculater = () => {
  const [cal, setCal] = useState(false);
  const [calInput, setCalInputValue] = useState(0);
  const [calOutput, setCalOutputlValue] = useState(0);
  const [open, setOpen] = useState(false);

  const { coinData } = useResponseStore();

  useEffect(() => {
    if (calInput) {
      setCalOutputlValue(((calInput*91820000) / 4800000).toFixed(5));
    }
  },[calInput]);

  if (!coinData) {
    return <NewLoading />;
  }

  return (
    <div className="w-full h-full border bg-white shadow-lg rounded-lg p-3 flex flex-col relative select-none">
      <div className="w-full h-1/2 flex flex-col">
        <div className="w-full h-[35%] flex items-center justify-between">
          <h1 className="text-xl text-slate-700 font-bold">FROM</h1>
          <div
            className="border rounded-lg bg-slate-700 px-2 py-1 flex items-center opacity-90 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <img src={BTC} alt="Coin-Logo" className="size-[20px]" />
            <div className="text-white ml-3 text-lg tracking-widest">BTC</div>
          </div>
        </div>
        <input
          type="number"
          className="w-full h-[35%] mt-3 bg-white rounded text-slate-700 outline-none pr-10 border-slate-700 border-[1.5px]"
          onChange={(e) => setCalInputValue(e.target.value)}
        />
      </div>
      <div className="w-full h-1/2 flex flex-col">
        <div className="w-full h-[35%] flex items-center justify-between">
          <h1 className="text-xl text-slate-700 font-bold">TO</h1>
          <div className="border rounded-lg bg-slate-700 px-2 py-1 flex items-center opacity-90">
            <img src={ETH} alt="Coin-Logo" className="size-[20px]" />
            <div className="text-white ml-3 text-lg tracking-widest">ETH</div>
          </div>
        </div>
        <input
          type="number"
          disabled
          value={calOutput}
          className="w-full select-none h-[35%] text-right mt-3 font-bold bg-slate-300 rounded outline-none text-slate-800 pl-1 border-slate-400 border-[1.5px]"
        />
      </div>
      <div
        className="absolute top-[50%] left-[45%] cursor-pointer hover:text-green-500"
        onClick={() => setCal(!cal)}
      >
        <RiExchangeBoxFill
          className={`size-[30px] rotate-90 group-hover:text-green-500 text-slate-700 ${
            cal ? "text-slate-700" : "text-slate-400"
          }`}
        />
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="w-[350px] h-[200px] flex justify-center items-center">
          <h1 className="text-slate-700 text-lg font-bold">Sorry, Please wait for the next update</h1>
        </div>
      </Modal>
    </div>
  );
};

export default Calculater;
