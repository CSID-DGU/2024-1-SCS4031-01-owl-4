import { BsMotherboard } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useTokenStore from "../utils/token";
import NewLoading from "./NewLoading";
import useResponseStore from "../utils/useResponseStore";
import { useNavigate } from "react-router-dom";

function formatDateAndTime(datetime) {
  
  const dateObj = new Date(datetime);

  
  const year = dateObj.getFullYear().toString().slice(-2); 
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); 
  const day = dateObj.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}/${month}/${day}`;

  
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const seconds = dateObj.getSeconds().toString().padStart(2, '0');

  const formattedTime = `${hours}:${minutes}:${seconds}`;

  return { formattedDate, formattedTime };
}

const PortfolioInfo = () => {
  const { token } = useTokenStore();
  const { isAPISuccess, setAutoInfo } = useResponseStore();
  const [date, setDate] = useState('24/05/24')
  const [time, setTime] = useState('15:34:27')
  const [capital, setCapital] = useState(0)
  const navigate = useNavigate();

  const {
    data: info,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["recent_tradings"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8081/api/v1/trading/logs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAutoInfo(response.data.payload)
      return response.data.payload || [];
    },
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    enabled: isAPISuccess,
  });

  useEffect(() => {
    if(info) {
      const {formattedDate, formattedTime} = formatDateAndTime(info.date)
      setDate(formattedDate)
      setTime(formattedTime)
      setCapital(info.capital)
    }
  },[info])


  // if(isLoading || !isError) {
  //   return <NewLoading />
  // }

  // if(!isAPISuccess) {
  //   return <NewLoading />
  // }

  return (
    <div className="w-full h-full rounded-lg shadow-lg border bg-white flex flex-col relative overflow-hidden">
      <div className="w-full h-[30%] flex relative bg-orange-500">
        <BsMotherboard className="size-[68px] absolute bottom-[-8px] right-[-2px] text-white" />
      </div>
      <div className="w-full h-[80%] absolute bottom-0 left-0 bg-slate-700 rounded-t-lg flex flex-col">
        <div className="w-full h-[32%] flex items-center px-3 py-2">
          <div className="font-bold text-white text-lg select-none">Recent Auto Purchase</div>
        </div>
        <div className="h-full px-3 flex flex-col relative">
          <div className="h-[57%] rounded-lg flex flex-col">
            <div className="w-full h-[48%] flex items-center">
              <div className="w-1/3 h-full flex justify-between">
                <div className={`w-[49%] h-full rounded-lg border-2 bg-red-500 border-slate-500 text-white font-bold flex justify-center items-center`}>
                  BUY
                  {/* ${info.type === '매수'? "bg-red-500":""} 넣어줄것 위의 bg-red-500 삭제할 것 */} 
                </div>
                <div className={`w-[49%] h-full rounded-lg border-2 border-slate-500 text-white font-bold flex justify-center items-center`}>
                  SELL
                  {/* ${info.type === '매도'? "bg-green-500":""} 넣어줄것 */}
                </div>
              </div>
              <div className="w-2/3 h-full flex justify-between items-center px-2 py-3">
                <div className="flex justify-center items-center text-white font-bold text-lg opacity-50">
                  {/* <span>D {date}</span> */}
                  <span>D 24/06/10</span>
                </div>
                <div className="flex justify-center items-center text-white font-bold text-lg opacity-50">
                  {/* <span>T {time}</span> */}
                  <span>T 17:28:57</span>
                </div>
              </div>
            </div>
            <div className="w-full h-[48%] flex justify-start items-center px-1 mt-1">
              <div className="text-white font-bold text-lg bg-slate-400 w-full rounded-lg px-3 py-1 mt-1">₩ 12630</div>
              {/* {capital} */}
            </div>
          </div>
          <button
            className="font-bold text-white text-lg p-1 bg-indigo-500 w-full rounded-full relative mt-3 overflow-hidden group select-none
           before:w-full before:h-full before:absolute before:bottom-0 before:left-0 before:rounded-full before:duration-500 before:transition-all before:translate-y-20 before:overflow-hidden
           hover:before:w-full hover:before:h-full hover:before:bg-indigo-700 hover:before:absolute hover:before:bottom-0 hover:before:left-0 hover:before:-translate-y-0 hover:before:opacity-40"
           onClick={() => navigate("./portfolio")}>
            Check Out Your Portfolio{" "}
            <span className="text-2xl font-bold text-white animate-ping group-hover:animate-none">
              »
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioInfo;
