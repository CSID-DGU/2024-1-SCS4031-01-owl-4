import { useEffect, useRef, useState } from "react";
import { IoIosArrowDropup } from "react-icons/io";

const CandleSelector = ({ setCandle, prevEnd, prevStart, setStart, setEnd }) => {
  const [openCandle, setOpenCandle] = useState(false);
  const dropdownRef = useRef(null);
  const [currency, setCurrency] = useState("1 Day");

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenCandle(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  

    return (
    <div
      className="w-[150px] ml-5 relative flex items-center bg-indigo-500 font-bold justify-between border rounded-lg shadow-lg px-2 py-1"
      onClick={() => {
        setOpenCandle(!openCandle);
        if (prevStart && prevEnd) {
          setStart(prevStart);
          setEnd(prevEnd);
        }
      }}
      ref={dropdownRef}
    >
      <div className="select-none text-white">{currency}</div>
      <IoIosArrowDropup
        className={`${openCandle ? "rotate-180" : ""} text-white`}
      />
      {openCandle && (
        <ul className="absolute w-full top-6 left-0 px-2 py-2 mt-2 rounded-lg bg-white z-20">
          <li
            className="flex cursor-pointer py-1 rounded-lg items-center justify-around bg-white hover:bg-slate-200 select-none"
            onClick={() => {
              setCurrency("1M");
              setCandle("minutes1");
              setOpenCandle(false);
            }}
          >
            <span className="text-sm font-normal select-none">1 M</span>
          </li>
          <li
            className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200 select-none"
            onClick={() => {
              setCurrency("3M");
              setCandle("minutes3");
              setOpenCandle(false);
            }}
          >
            <span className=" text-sm font-normal select-none">3 M</span>
          </li>
          <li
            className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200"
            onClick={() => {
              setCurrency("5 M");
              setCandle("minutes5");
              setOpenCandle(false);
            }}
          >
            <span className=" text-sm font-normal select-none">5 M</span>
          </li>
          <li
            className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200"
            onClick={() => {
              setCurrency("10 M");
              setCandle("minutes10");
              setOpenCandle(false);
            }}
          >
            <span className=" text-sm font-normal select-none">10 M</span>
          </li>
          <li
            className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200"
            onClick={() => {
              setCurrency("15 M");
              setCandle("minutes15");
              setOpenCandle(false);
            }}
          >
            <span className=" text-sm font-normal select-none">15 M</span>
          </li>
          <li
            className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200"
            onClick={() => {
              setCurrency("30 M");
              setCandle("minutes30");
              setOpenCandle(false);
            }}
          >
            <span className=" text-sm font-normal select-none">30 M</span>
          </li>
          <li
            className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200"
            onClick={() => {
              setCurrency("1 H");
              setCandle("minutes60");
              setOpenCandle(false);
            }}
          >
            <span className=" text-sm font-normal select-none">1 H</span>
          </li>
          <li
            className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200"
            onClick={() => {
              setCurrency("4 H");
              setCandle("minutes240");
              setOpenCandle(false);
            }}
          >
            <span className=" text-sm font-normal select-none">4 H</span>
          </li>
          <li
            className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200"
            onClick={() => {
              setCurrency("1 DAY");
              setCandle("days");
              setOpenCandle(false);
            }}
          >
            <span className=" text-sm font-normal select-none">1 DAY</span>
          </li>
          <li
            className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200"
            onClick={() => {
              setCurrency("1 Week");
              setCandle("weeks");
              setOpenCandle(false);
            }}
          >
            <span className=" text-sm font-normal select-none">1 Week</span>
          </li>
          <li
            className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200"
            onClick={() => {
              setCurrency("1 Month");
              setCandle("months");
              setOpenCandle(false);
            }}
          >
            <span className=" text-sm font-normal select-none">1 Month</span>
          </li>
        </ul>
      )}
    </div>
  );
};

export default CandleSelector;
