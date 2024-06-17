import { BsMotherboard } from "react-icons/bs";


const PortfolioInfo = () => {
  return (
    <div className="w-full h-full rounded-lg shadow-lg border bg-white flex flex-col relative overflow-hidden">
      <div className="w-full h-[30%] flex relative bg-orange-500">
        <BsMotherboard className="size-[68px] absolute bottom-[-6px] right-[-2px] text-white" />
      </div>
      <div className="w-full h-[73%] absolute bottom-0 left-0 bg-slate-700 rounded-t-lg"></div>
    </div>
  );
};

export default PortfolioInfo;
