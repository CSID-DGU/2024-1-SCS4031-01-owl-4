import useResponseStore from "../utils/useResponseStore";
import { getImageURL } from "../utils/image-utils";

const Markets = ({item, close}) => {
    const{setCoinName, setMarketName} = useResponseStore()

  return (
    <>
      <li
        className="w-full flex items-center justify-around py-2 border-b hover:bg-slate-100 cursor-pointer"
        onClick={() => {
            setCoinName(item.korean_name)
            setMarketName(item.market_name)
            close()}}
      >
        <div className="w-[10%] flex justify-center items-center">
          <img src={getImageURL(item.market_name.split('-')[1])} alt="coinLogos" className="size-[25px]" />
        </div>
        <div className="w-[68%] h-full flex px-5">
          <div className="w-3/5 text-center flex justify-start">{item.english_name.toUpperCase()}</div>
          <div className="w-2/5 text-center flex justify-end">{item.korean_name}</div>
        </div>
        <div className="w-[15%] text-sm text-end mr-2 flex justify-center">{item.market_name}</div>
      </li>
    </>
  );
};

export default Markets;
