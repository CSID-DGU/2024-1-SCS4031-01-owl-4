import { FaArrowCircleRight } from "react-icons/fa";
import usePortfolioOpenPageStore from '../utils/portfolioOpenPageStore';
import useTokenStore from '../utils/token';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import useResponseStore from "../utils/useResponseStore";
import { useEffect, useState } from "react";

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const PortfolioList = ({ item, onClick, isSelected, refetchingData }) => {
    const { isCurrentPage, setIsCurrentPage } = usePortfolioOpenPageStore();
    const { setResponsePortfolio } = useResponseStore();
    const { token } = useTokenStore();
    const [isChecked, setIsChecked] = useState(item.is_marked); // Initialize with item.is_marked

    const autoPurchaseToggle = item.trade;
    const autoPurchaseToggleStyle = autoPurchaseToggle ? "bg-lime-400" : "bg-red-400";

    const { data, refetch } = useQuery({
        queryKey: ['portfolioInfos', isCurrentPage],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:8081/api/v1/portfolios/detail?portfolio_id=${isCurrentPage}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setResponsePortfolio(response.data.payload);
            console.log(response.data.payload)
            return response.data.payload || [];
        },
        enabled: isCurrentPage === item.portfolio_id
    });

    const mutationBookMarkDelete = useMutation({
        mutationFn: async () => {
            const response = await axios.delete(`http://localhost:8081/api/v1/portfolios/bookmark?portfolio_id=${item.portfolio_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);
        },
        onSuccess: () => {
            refetchingData(); // Call refetchingData to refresh data
        }
    });

    const mutationBookMarkPost = useMutation({
        mutationFn: async () => {
            const response = await axios.post(`http://localhost:8081/api/v1/portfolios/bookmark?portfolio_id=${item.portfolio_id}`, '', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);
        },
        onSuccess: () => {
            refetchingData(); // Call refetchingData to refresh data
        }
    });

    const handleClick = () => {
        if (isCurrentPage !== item.portfolio_id) {
            setIsCurrentPage(item.portfolio_id);
        }
    };

    const handleBookmarkChange = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        setIsChecked(!isChecked);
        if (!isChecked) {
            mutationBookMarkPost.mutate();
        } else {
            mutationBookMarkDelete.mutate();
        }
    };

    useEffect(() => {
        if (isCurrentPage === item.portfolio_id) {
            refetch();
        }
    }, [isCurrentPage, item.portfolio_id]);

    useEffect(() => {
        setIsChecked(item.is_marked); // Sync with item.is_marked when item changes
    }, [item.is_marked]);

    return (
        <div className="relative">
            <input
                type="checkbox"
                className='w-[25px] h-[25px] z-10 absolute -left-3 top-[50px] custom-checkbox border border-slate-300 bg-white'
                checked={isChecked}
                onChange={handleBookmarkChange}
                onClick={(e) => e.stopPropagation()} // Prevent onClick from firing
            />
            <div
                className={`w-full h-[80px] bg-white mt-6 rounded-xl border shadow-md relative flex cursor-pointer hover:border-2 hover:border-red-500 ${isSelected ? "border-red-500 border-2" : ""}`}
                onClick={onClick}
            >
                <div className='w-[42%] flex items-center'>
                    <span className='block ml-8 truncate font-bold'>{item.title}</span>
                </div>
                <div className='w-[28%] flex flex-col border-l items-center text-sm'>
                    <span className='w-full h-1/2 flex justify-center items-center border-b font-bold'>{formatDate(item.start_date)}</span>
                    <span className='w-full h-1/2 flex justify-center items-center font-bold'>{formatDate(item.end_date)}</span>
                </div>
                <div className='w-[13%] flex justify-center items-center border-l'>
                    <span className='font-bold text-sm'>{item.candle_name}</span>
                </div>
                <div className='w-[17%] flex justify-center items-center text-base border-l'>
                    <div className={`w-3 h-3 rounded-full mr-3 ${autoPurchaseToggleStyle}`}></div>
                    <span className='font-bold'>{autoPurchaseToggle ? 'ON' : 'OFF'}</span>
                </div>
            </div>
            <button className='absolute top-[50px] -right-4 bg-white' onClick={(e) => { e.stopPropagation(); handleClick(); }}>
                <FaArrowCircleRight className={`w-[25px] h-[25px] hover:text-black ${isCurrentPage === item.portfolio_id ? "" : "text-slate-400"}`} />
            </button>
        </div>
    );
};

export default PortfolioList;