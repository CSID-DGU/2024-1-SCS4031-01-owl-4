import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useTokenStore from '../../utils/token';
import { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { LuListFilter } from "react-icons/lu";
import PortfolioList from '../../components/PortfolioList';
import usePortfolioOpenPageStore from '../../utils/portfolioOpenPageStore';
import useResponseStore from '../../utils/useResponseStore';

const ITEMS_PER_PAGE = 5;

const Portfolio = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchToggle, setSearchToggle] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const { token } = useTokenStore();
  const {setIsCurrentPage} = usePortfolioOpenPageStore();
  const {responsePortfolio} = useResponseStore();
  
  const { data, error, isLoading, } = useQuery({
    queryKey: ['portfolios'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8081/api/v1/portfolios', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data.payload)
      return response.data.payload || [];
    },
  });

  useEffect(() => {
    if (!isLoading && data && data.length > 0) {
      setItemsData(data);
      setIsCurrentPage(data[0].portfolio_id);
    }
  }, [data, isLoading, setIsCurrentPage]);

  if (isLoading) return <div>로딩 중...</div>;

  if (error) return <div>포트폴리오를 불러오는 중 에러 발생</div>;

  const totalPages = Math.ceil(itemsData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = itemsData.slice(startIndex, startIndex + ITEMS_PER_PAGE);


  const handleToggle = () => {
    setSearchToggle(!searchToggle)
  }

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  const handleSelectItem = (item) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(item)
        ? prevSelectedItems.filter((i) => i !== item)
        : [...prevSelectedItems, item]
    );
  };

  const handleDeleteSelected = () => {
    setItemsData((prevData) => prevData.filter((item) => !selectedItems.includes(item)));
    setSelectedItems([]);
  };


  const toggleSearchFormStyle = searchToggle ? "bg-blue-200 cursor-pointer" : "w-full bg-white border border-slate-300"
  const toggleSearchInputStyle = searchToggle ? "w-0" : "w-[320px] delay-500"
  const toggleSearchIconStyle = searchToggle ? "left-[-20%] delay-300" : "left-[-5%]"
  
  return (
    <div className="w-full bg-slate-200 p-10">
      <div className='w-full h-[788px] bg-white rounded-xl flex'>
        <div className='w-2/5 h-full py-5 pl-5 pr-2'>
          <div className='w-full h-full bg-white shadow-xl rounded-xl border py-3 px-4 flex flex-col'>
            <h1 className='font-bold text-xl'>PORTFOLIO</h1>
            <hr className='mt-3 border-[2px] border-slate-200 border-dashed'/>
            <div className='mt-5 flex'>
              <form action="" className={`size-[35px] relative flex justify-end items-center rounded-full ${toggleSearchFormStyle} transition-all duration-1000`}>
                <input type="text" className={`relative ${toggleSearchInputStyle} -left-5 outline-none`} />
                <FaSearch className={`size-[18px] relative duration-500 ease-in-out cursor-pointer ${toggleSearchIconStyle}`} onClick={handleToggle}/>
              </form>
              <div className='flex ml-2'>
                <button className='relative mr-2 px-2 rounded-full bg-blue-200 group
                before:w-0 before:h-0 before:bg-green-500 before:absolute before:top-4 before:right-4 before:rounded-full
                hover:before:w-full hover:before:h-full hover:before:duration-300 hover:before:translate-x-4 hover:before:-translate-y-4'>
                  <IoMdAddCircle className='relative size-[20px] z-10 group-hover:text-white' />
                </button>
                <button className='relative mr-2 px-2 rounded-full bg-blue-200 group
                before:w-0 before:h-0 before:bg-red-500 before:absolute before:top-4 before:right-4 before:rounded-full
                hover:before:w-full hover:before:h-full hover:before:duration-300 hover:before:translate-x-4 hover:before:-translate-y-4'
                onClick={handleDeleteSelected}>
                  <MdDelete className='relative size-[20px] z-10 group-hover:text-white' />
                </button>
                <button className='relative px-2 rounded-full bg-blue-200 group
                before:w-0 before:h-0 before:bg-blue-600 before:absolute before:top-4 before:right-4 before:rounded-full
                hover:before:w-full hover:before:h-full hover:before:duration-300 hover:before:translate-x-4 hover:before:-translate-y-4'>
                  <LuListFilter className='relative size-[20px] z-10 group-hover:text-white' />
                </button>
              </div>
            </div>

            <div className='mt-5 mb-1 w-full h-full flex flex-col relative'>

              <div className='w-full h-[30px] bg-slate-100 border shadow-md flex text-sm py-1 text-slate-600'>
                <div className='w-[42%] text-center'>Title</div>
                <div className='w-[28%] text-center'>Date</div>
                <div className='w-[13%] text-center'>Candle</div>
                <div className='w-[17%] text-center'>Purchase</div>
              </div>

              {paginatedItems.map((item) => (
                <PortfolioList
                  key={item.portfolio_id}
                  item={item}
                  onClick={() => handleSelectItem(item)}
                  isSelected={selectedItems.includes(item)}
                />
              ))}
              
              <div className="flex justify-center absolute left-0 bottom-0">
                {

                  Array.from({ length: totalPages }, (_, index) => (
                    <button key={index} onClick={() => handleClick(index + 1)} className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                      {index + 1}
                    </button>))

                }
              </div>

            </div>
          </div>
        </div>
        <div className='w-3/5 h-full py-5 pr-5 pl-2'>
            <div className='w-full h-full bg-white rounded-xl shadow-xl border p-5 overflow-x-hidden'>
              <div className='w-full h-[300px] bg-slate-400'></div>
              <div className='w-full h-[300px] bg-slate-400 mt-5'></div>
              <div className='w-full h-[300px] bg-slate-400 mt-5'></div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
