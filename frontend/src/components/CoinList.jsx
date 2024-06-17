import { getImageURL } from "../utils/image-utils";

const CoinList = ({ coin }) => {
  const formattedBalance = parseFloat(coin.balance).toFixed(2);
  const formattedPrice = parseFloat(coin.price).toFixed(1);
  let formattedRate;

  if (Math.abs(coin.rate) === 0) {
    formattedRate = "0";
  } else {
    formattedRate = (Math.abs(coin.rate) * 100).toFixed(2);
  }
  
  const trendColor = coin.is_increase
    ? "bg-green-500"
    : formattedRate === "0"
    ? "bg-slate-400"
    : "bg-red-500";

  return (
    <div className={`flex h-[23%] items-center mt-2`}>
      <img
        src={getImageURL(coin.market_name.split("-")[1])}
        alt="Coin-Logo"
        className="size-[35px]"
      />
      <div className="w-[70%] flex flex-col mx-2">
        <div className="w-full flex justify-between">
          <span className="font-bold">{coin.english_name}</span>
          <span className="font-bold">₩{formattedBalance}</span>
        </div>
        <div className="w-full flex justify-between mt-1">
          <span className="text-xs font-bold">
            {coin.korean_name}
          </span>
          <span className="text-xs font-bold">{coin.coin_count} {coin.market_name.split("-")[1]}</span>
        </div>
      </div>
      <div
        className={`w-[50px] h-full ${trendColor} rounded-full flex justify-center items-center`}
      >
        <span className="text-white font-bold text-sm">{formattedRate === 0 ? 0: formattedRate}%</span>
      </div>
    </div>
  );
};

export default CoinList;
