import useResponseStore from "../utils/useResponseStore";

const Markets = ({item, close}) => {


    const{setCoinName, setMarketName} = useResponseStore()

  return (
    <>
      <li
        className="w-full flex items-center justify-around py-2 border-b px-2 hover:bg-slate-100 cursor-pointer"
        onClick={() => {
            setCoinName(item.korean_name)
            setMarketName(item.market_name)
            close()}}
      >
        <div className="w-[12%] text-start ml-3">IMAGE</div>
        <div className="w-[76%] h-full flex justify-between">
          <div className="w-1/2 text-center">{item.english_name.toUpperCase()}</div>
          <div className="w-1/2 text-center">{item.korean_name}</div>
        </div>
        <div className="w-[12%] text-sm text-end mr-2">{item.market_name}</div>
      </li>
    </>
  );
};

export default Markets;
