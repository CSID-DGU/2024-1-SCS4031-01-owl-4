import BackTestChart from '../../layouts/DashBoard/Run/BackTestChart';
import BackTestTable from '../../layouts/DashBoard/Run/BackTestTable';
import useResponseStore from '../../utils/useResponseStore';

const Run = () => {
  const { responseBackTest } = useResponseStore();
  console.log(responseBackTest);

  if (!responseBackTest?.payload) {
    return <div>Loading...</div>;
  }

  const {
    trading,
    performance,
    trading_logs
  } = responseBackTest.payload;

  return (
    <div className='w-full h-full bg-slate-200 p-10'>
      <div className='w-full h-full bg-white rounded-xl flex p-3'>
        <BackTestTable trading = {trading} performance={performance} trading_logs={trading_logs} />
        <BackTestChart trading = {trading} performance={performance} trading_logs={trading_logs} />
      </div>
   </div>

  //   <div className="w-full bg-slate-200 p-5">
  //     <h1 className="text-2xl font-bold mb-4">Backtest Results</h1>

  //     <div className="mb-6">
  //       <h2 className="text-xl font-semibold">Trading Logs</h2>
  //     </div>
  //   </div>
  );
}

export default Run;