import { useState } from 'react';
import CoinPriceChart from "../../../components/CoinPriceChart";
import TradingProfitRateChart from "../../../components/TradingProfitRateChart";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

const schema = z.object({
  comment: z.string().min(1, { message: "Comment is required" }).max(200, { message: "Comment must be less than 200 characters" }),
});

const BackTestChart = ({trading, performance, trading_logs}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });
  const [charCount, setCharCount] = useState(0);

  const mutation = useMutation(commentData => axios.post('http://localhost:8081/api/v1/backtesting/save', commentData));

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleCommentChange = (e) => {
    setCharCount(e.target.value.length);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-1/2 p-3 flex">
        <CoinPriceChart/>
      </div>
      <div className="w-full h-1/2 flex">
        <div className="w-3/5 h-full p-5">
          <TradingProfitRateChart />
        </div>
        <div className="w-2/5 flex justify-center items-center py-5 pr-5 pl-1">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full border rounded-xl shadow-xl p-3 flex flex-col relative">
            <h1 className="font-bold text-2xl ml-4 mt-3">Comment</h1>
            <div className="relative w-full h-3/4 my-4">
              <textarea 
                {...register('comment')} 
                className="w-full h-full p-2 border rounded" 
                placeholder="Write your comment here..." 
                maxLength={200} 
                onChange={handleCommentChange}
              />
              <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                {charCount}/200
              </div>
            </div>
            {errors.comment && <span className="text-red-500">{errors.comment.message}</span>}
            <button type="submit" className="w-full mt-auto bg-blue-500 text-white py-2 rounded">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BackTestChart;
