import { useEffect, useState, useRef } from "react";
import Progressbar from "./Progressbar";
import axios from "axios";
import useTokenStore from "../utils/token";
import NewLoading from "./NewLoading";
import { useQuery } from "@tanstack/react-query";
import useResponseStore from "../utils/useResponseStore";
import { getImageURL } from "../utils/image-utils";

const WatchList = () => {

  const { setIsAPISuccess, setIsAPISuccessFirst, setCoinData } = useResponseStore();
  

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["coincontent"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8081/api/v1/dashboard/coins/representative`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.payload;
    },
    refetchInterval: 4000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    throwOnError: false,
    retry: 0,
  });

  const [progress, setProgress] = useState(0);
  const [slidesControl, setSlidesControl] = useState(0);
  const slidesIntervalRef = useRef(null);
  const slidesToShow = 3;
  const totalContainers = Math.ceil(data?.length / slidesToShow || 0);
  const slideDuration = 5000;
  const { token } = useTokenStore();

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) =>
        prev < 100 ? prev + 100 / (slideDuration / 1000) : 0
      );
    }, 1000);
    return () => clearInterval(progressInterval);
  }, [slideDuration]);

  useEffect(() => {
    slidesIntervalRef.current = setInterval(() => {
      setSlidesControl((prev) => (prev < totalContainers - 1 ? prev + 1 : 0));
      setProgress(0);
    }, slideDuration);
    return () => clearInterval(slidesIntervalRef.current);
  }, [totalContainers, slideDuration]);

  const resetSlideInterval = () => {
    clearInterval(slidesIntervalRef.current);
    slidesIntervalRef.current = setInterval(() => {
      setSlidesControl((prev) => (prev < totalContainers - 1 ? prev + 1 : 0));
      setProgress(0);
    }, slideDuration);
  };

  const prevSlide = () => {
    setSlidesControl((prevIndex) =>
      prevIndex === 0 ? totalContainers - 1 : prevIndex - 1
    );
    setProgress(0);
    resetSlideInterval();
  };

  const nextSlide = () => {
    setSlidesControl((prevIndex) =>
      prevIndex === totalContainers - 1 ? 0 : prevIndex + 1
    );
    setProgress(0);
    resetSlideInterval();
  };

  const goToSlide = (index) => {
    setSlidesControl(index);
    setProgress(0);
    resetSlideInterval();
  };

  useEffect(() => {
    if (isSuccess) {
      setIsAPISuccessFirst(true);
      setIsAPISuccess(true);
      setCoinData(data)
    } else {
      setIsAPISuccess(false);
    }
  }, [isSuccess, setIsAPISuccess, setIsAPISuccessFirst, data, setCoinData]);

  if (isLoading) return <NewLoading />;
  if (data)
  return (
    <div className="w-full h-full bg-white flex flex-col relative overflow-hidden justify-between items-center select-none">
      <div className="relative w-full h-full overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500"
          style={{ transform: `translateX(-${slidesControl * 100}%)` }}
        >
          {Array.from({ length: totalContainers }).map((_, containerIndex) => (
            <div key={containerIndex} className="flex-shrink-0 w-full flex">
              {data
                .slice(
                  containerIndex * slidesToShow,
                  containerIndex * slidesToShow + slidesToShow
                )
                .map((coin, slideIndex) => (
                  <div
                    key={slideIndex}
                    className="w-[31.5%] flex-shrink-0 flex flex-col relative justify-center items-center mx-[6px] border-2 rounded-xl overflow-hidden"
                  >
                    <div className="size-[70px] absolute top-[30%] left-[34%] rounded-full bg-slate-700 p-3 z-10">
                      <img
                        src={getImageURL(coin.market_name.split("-")[1])}
                        alt="Coin-Logo"
                        className="object-cover"
                      />
                    </div>
                    <div
                      className={`w-full h-1/2 text-slate-700 font-bold p-3 relative ${
                        coin.is_increase ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      <span className="absolute top-3 left-3 text-lg">
                        {coin.english_name}
                      </span>
                      <span className="absolute top-3 right-3 text-lg text-white">
                        {Math.abs(parseFloat(coin.change_rate).toFixed(2))}%
                      </span>
                    </div>
                    <div className="w-full h-1/2 relative bg-slate-700 text-white">
                      <div className="absolute bottom-[59%] left-3 text-sm font-bold tracking-widest">
                        {coin.market_name.split("-")[1]} (
                        <span className="tracking-widest">
                          {coin.market_name.split("-")[0]}
                        </span>
                        )
                      </div>
                      <div className="text-xl font-bold absolute bottom-[28%] left-3">
                        ₩ {coin.change_price}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
      {isLoading ? "" : (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-[40%] left-3 bg-white p-2 rounded-full"
          >
            &lt;
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-[40%] right-4 bg-white p-2 rounded-full"
          >
            &gt;
          </button>
          <div className="absolute bottom-3 left-4 flex justify-center mt-4">
            {Array.from({ length: totalContainers }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 w-3 mx-1 rounded-full ${
                  slidesControl === index ? "bg-white" : "bg-slate-400"
                }`}
              />
            ))}
          </div>
          <div className="absolute bottom-3 right-3">
            <Progressbar progress={progress} />
          </div>
        </>
      )}
    </div>
  );
};

export default WatchList;


