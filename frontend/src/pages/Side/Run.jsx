import BackTestChart from '../../layouts/DashBoard/Run/BackTestChart';
import BackTestTable from '../../layouts/DashBoard/Run/BackTestTable';
import useResponseStore from '../../utils/useResponseStore';

const Run = () => {
  const { responseBackTest } = useResponseStore();

  if (!responseBackTest?.payload) {
    return <div>Loading...</div>;
  }
  
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

export default Run;
