import { useEffect, useState, useRef } from "react";
import BTC from "../assets/coinLogoImages/BTC.png";
import AAVE from "../assets/coinLogoImages/AAVE.png";
import NEO from "../assets/coinLogoImages/NEO.png";
import ADA from "../assets/coinLogoImages/ADA.png";
import AERGO from "../assets/coinLogoImages/AERGO.png";
import AHT from "../assets/coinLogoImages/AHT.png";
import AKT from "../assets/coinLogoImages/AKT.png";
import ALGO from "../assets/coinLogoImages/ALGO.png";
import AQT from "../assets/coinLogoImages/AQT.png";
import Progressbar from "./Progressbar";

const images = [BTC, AAVE, NEO, ADA, AERGO, AHT, AKT, ALGO, AQT];

const WatchList = () => {
  const [progress, setProgress] = useState(0);
  const [slidesControl, setSlidesControl] = useState(0);
  const slidesIntervalRef = useRef(null);
  const slidesToShow = 3;
  const totalContainers = Math.ceil(images.length / slidesToShow);
  const slideDuration = 5000
  
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + (100 / (slideDuration / 1000)) : 0));
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

  return (
    <div className="w-full h-full bg-white flex flex-col relative overflow-hidden justify-between items-center select-none">
      <div className="relative w-full h-full overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500"
          style={{ transform: `translateX(-${slidesControl * 100}%)` }}
        >
          {Array.from({ length: totalContainers }).map((_, containerIndex) => (
            <div key={containerIndex} className="flex-shrink-0 w-full flex">
              {images
                .slice(
                  containerIndex * slidesToShow,
                  containerIndex * slidesToShow + slidesToShow
                )
                .map((image, slideIndex) => (
                  <div
                    key={slideIndex}
                    className="w-[31.5%] flex-shrink-0 flex flex-col relative justify-center items-center mx-[6px] border-2 rounded-xl overflow-hidden"
                  >
                    <div className="size-[70px] absolute top-[30%] left-[34%] rounded-full bg-slate-700 p-3 z-10">
                      <img
                        src={image}
                        alt="Coin-Logo"
                        className="object-cover"
                      />
                    </div>
                    <div
                      className={`w-full h-1/2 text-slate-700 font-bold p-3 relative ${
                        slideIndex % 2 === 0 ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      <span className="absolute top-3 left-3 text-lg">
                        BITCOIN
                      </span>
                      <span className="absolute top-3 right-3 text-lg text-white">
                        % 0.23
                      </span>
                    </div>
                    <div className="w-full h-1/2 relative bg-slate-700 text-white">
                      <div className="absolute bottom-[59%] left-3 text-sm font-bold tracking-widest">
                        BTC (<span className="tracking-widest">KRW</span>)
                      </div>
                      <div className="text-xl font-bold absolute bottom-[28%] left-3">
                        $1239238908
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
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
    </div>
  );
};

export default WatchList;
