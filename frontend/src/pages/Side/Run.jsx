import BackTestChart from '../../layouts/DashBoard/Run/BackTestChart';
import BackTestTable from '../../layouts/DashBoard/Run/BackTestTable';
import useResponseStore from '../../utils/useResponseStore';
import axios from 'axios';
import { useQuery } from "@tanstack/react-query";
import useTokenStore from "../../utils/token";


const Run = () => {

  const { token } = useTokenStore();

  const {data: recentBacktestingData, isLoading: isRecentDataLoading} = useQuery({
    queryKey: ["BackTestingInfos"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:8081/api/v1/backtesting/recent",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log(response)
      return response.data.payload || []
    }
  });

  const { responseBackTest } = useResponseStore();

  if(isRecentDataLoading){
    return <div>Load Recent BackTesting Data</div>
  }

  if(!recentBacktestingData){
    return <div>No Recent BackTesting Data</div>
  }

  if (responseBackTest?.payload) {
    const {
      trading,
      performance,
      trading_logs,
      portfolio_id
    } = responseBackTest.payload;

    return (
      <div className='w-full h-full bg-slate-200 p-10'>
      <div className='h-full bg-white rounded-xl flex p-3'>
        <BackTestTable trading = {trading} performance={performance} />
        <BackTestChart trading = {trading} performance={performance} trading_logs={trading_logs} portfolio_id={portfolio_id} />
      </div>
   </div>
    );
  }

  const {
    trading,
    performance,
    trading_logs,
    portfolio_id,
    is_saved
  } = recentBacktestingData;
  
  console.log(recentBacktestingData)
  return (
    <div className='w-full h-full bg-slate-200 p-10'>
      <div className='h-full bg-white rounded-xl flex p-3'>
        <BackTestTable trading = {trading} performance={performance} />
        <BackTestChart trading = {trading} performance={performance} trading_logs={trading_logs} portfolio_id={portfolio_id} save= {is_saved} />
      </div>
   </div>

  );
}

export default Run;
