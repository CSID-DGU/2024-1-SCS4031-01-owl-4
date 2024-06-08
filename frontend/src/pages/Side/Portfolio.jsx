import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import useTokenStore from "../../utils/token";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { LuListFilter } from "react-icons/lu";
import PortfolioList from "../../components/PortfolioList";
import usePortfolioOpenPageStore from "../../utils/portfolioOpenPageStore";
import useResponseStore from "../../utils/useResponseStore";
import { useNavigate } from "react-router-dom";
import { MdDescription } from "react-icons/md";
import { MdComment } from "react-icons/md";
import PortfolioProfitChart from "../../components/PortfolioProfitChart";
import PortfolioCountChart from "../../components/PortfolioCountChart";

const ITEMS_PER_PAGE = 5;

const Portfolio = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchToggle, setSearchToggle] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { token } = useTokenStore();
  const { setIsCurrentPage } = usePortfolioOpenPageStore();
  const navigate = useNavigate();
  const { responsePortfolio } = useResponseStore();
  const [portfolioDetailTradingData, setPortfolioDetailTradingData] = useState({});
  const [portfolioDetailPerformanceData, setPortfolioDetailPerformanceData] =useState({});
  const [portfolioTextId, setportfolioTextId] = useState('description');
  
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["portfolios"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:8081/api/v1/portfolios",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data.payload);
      return response.data.payload || [];
    },
  });

  const mutation = useMutation({
    mutationFn: async (portfolio_ids) => {

      for (let index = 0; index < portfolio_ids.length; index++) {
        const response = await axios.delete(
          "http://localhost:8081/api/v1/portfolios?portfolio_id=" +
            portfolio_ids[index],
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
      }
    },
    onSuccess: () => {
      setSelectedItems([]);
      refetch();
    },
  });

  useEffect(() => {
    setPortfolioDetailTradingData(responsePortfolio.trading || {});
    setPortfolioDetailPerformanceData(responsePortfolio.performance || {});
  }, [responsePortfolio]);

  useEffect(() => {
    if (!isLoading && data && data.length > 0) {
      const reversedData = [...data].reverse(); // Reverse the order of data
      const sortedData = reversedData.sort((a, b) => b.is_marked - a.is_marked); // 체크된 항목을 우선 순위로 정렬
      setItemsData(sortedData);
      setIsCurrentPage(sortedData[0].portfolio_id);
    }
  }, [data, isLoading, setIsCurrentPage]);

  useEffect(() => {
    const filteredData = itemsData.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    setPaginatedData(
      filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    );
  }, [itemsData, searchQuery, currentPage]);

  if (isLoading) return <div>로딩 중...</div>;

  if (error) return <div>포트폴리오를 불러오는 중 에러 발생</div>;

  const handleToggle = () => {
    setSearchToggle(!searchToggle);
  };

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
    if (selectedItems.length === 0) {
      return console.log("no delete data");
    }
  
    mutation.mutate(
      selectedItems.map((item) => {
        console.log(item.portfolio_id);
        return item.portfolio_id;
      }),
      {
        onSuccess: () => {
          setSelectedItems([]);
          refetch().then(() => {
            const totalItemsAfterDeletion = itemsData.filter((item) =>
              item.title.toLowerCase().includes(searchQuery.toLowerCase())
            ).length - selectedItems.length;
            const totalPagesAfterDeletion = Math.ceil(totalItemsAfterDeletion / ITEMS_PER_PAGE);
  
            if (currentPage > totalPagesAfterDeletion) {
              setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
            }
          });
        }
      }
    );
  };

  const handleSearchFilter = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // 검색어가 변경되면 첫 페이지로 초기화
  };

  const totalPages = Math.ceil(
    itemsData.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ).length / ITEMS_PER_PAGE
  );

  const handleAddPortfolio = () => {
    return navigate("/dashboard/strategy");
  };

  const handlePortfolioText = (id) => {
    return setportfolioTextId(id)
  }

  const {
    initial_capital,
    final_capital,
    total_trade_count,
    positive_trade_count,
    negative_trade_count,
    average_trade_period,
    average_positive_trade,
    average_negative_trade,
  } = portfolioDetailTradingData;
  const {
    total_rate,
    win_rate,
    loss_rate,
    win_loss_ratio,
    high_value_strategy,
    low_value_strategy,
    high_loss_value_strategy,
  } = portfolioDetailPerformanceData;

  const toggleSearchFormStyle = searchToggle
    ? "bg-blue-200 cursor-pointer"
    : "w-full bg-white border border-slate-300";
  const toggleSearchInputStyle = searchToggle ? "w-0" : "w-[85%] delay-500";
  const toggleSearchIconStyle = searchToggle
    ? "left-[-20%] delay-300"
    : "left-[-5%]";

  const togglePortfolioDescriptionStyle = portfolioTextId !== 'description' ? "" : "border-b-[2px] border-violet-400 text-violet-400"
  const togglePortfolioCommentStyle = portfolioTextId === 'comment' ? "border-b-[2px] border-violet-400 text-violet-400" : ""

  return (
    <div className="w-full bg-slate-200 p-10">
      <div className="w-full h-[788px] bg-white rounded-xl flex">
        <div className="w-2/5 h-full py-5 pl-5 pr-2">
          <div className="w-full h-full bg-white shadow-xl rounded-xl border py-3 px-4 flex flex-col">
            <h1 className="font-bold text-xl">PORTFOLIO</h1>
            <hr className="mt-3 border-[2px] border-slate-200 border-dashed" />
            <div className="mt-5 flex">
              <form
                action=""
                className={`size-[35px] relative flex justify-end items-center rounded-full ${toggleSearchFormStyle} transition-all duration-1000`}
              >
                <input
                  type="text"
                  className={`relative ${toggleSearchInputStyle} -left-5 outline-none`}
                  onChange={handleSearchFilter}
                />
                <FaSearch
                  className={`size-[18px] relative duration-500 ease-in-out cursor-pointer ${toggleSearchIconStyle}`}
                  onClick={handleToggle}
                />
              </form>
              <div className="flex ml-2">
                <button
                  className="relative mr-2 px-2 rounded-full bg-blue-200 group
                before:w-0 before:h-0 before:bg-green-500 before:absolute before:top-4 before:right-4 before:rounded-full
                hover:before:w-full hover:before:h-full hover:before:duration-300 hover:before:translate-x-4 hover:before:-translate-y-4"
                  onClick={handleAddPortfolio}
                >
                  <IoMdAddCircle className="relative size-[20px] z-10 group-hover:text-white" />
                </button>
                <button
                  className="relative mr-2 px-2 rounded-full bg-blue-200 group
                before:w-0 before:h-0 before:bg-red-500 before:absolute before:top-4 before:right-4 before:rounded-full
                hover:before:w-full hover:before:h-full hover:before:duration-300 hover:before:translate-x-4 hover:before:-translate-y-4"
                  onClick={handleDeleteSelected}
                >
                  <MdDelete className="relative size-[20px] z-10 group-hover:text-white" />
                </button>
                <button
                  className="relative px-2 rounded-full bg-blue-200 group
                before:w-0 before:h-0 before:bg-blue-600 before:absolute before:top-4 before:right-4 before:rounded-full
                hover:before:w-full hover:before:h-full hover:before:duration-300 hover:before:translate-x-4 hover:before:-translate-y-4"
                >
                  <LuListFilter className="relative size-[20px] z-10 group-hover:text-white" />
                </button>
              </div>
            </div>

            <div className="mt-5 mb-1 w-full h-full flex flex-col relative">
              <div className="w-full h-[30px] bg-slate-100 border shadow-md flex text-sm py-1 text-slate-600">
                <div className="w-[42%] text-center">Title</div>
                <div className="w-[28%] text-center">Date</div>
                <div className="w-[13%] text-center">Candle</div>
                <div className="w-[17%] text-center">Purchase</div>
              </div>

              {paginatedData.map((item) => (
                <PortfolioList
                  key={item.portfolio_id}
                  item={item}
                  onClick={() => handleSelectItem(item)}
                  isSelected={selectedItems.includes(item)}
                  refetchingData={() => refetch()}
                />
              ))}

              <div className="flex justify-center absolute left-0 bottom-0">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handleClick(index + 1)}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="w-3/5 h-full py-5 pr-5 pl-2">
          <div className="w-full h-full bg-white rounded-xl shadow-xl border p-5 overflow-x-hidden">
            <div className="w-full h-[300px] flex justify-between items-center">
              <div className="w-full h-full border shadow-lg flex flex-col rounded-lg">
                <ul className="basis-[80px] flex items-center font-bold text-md border-b-[1px] border-slate-300">
                  <li className={`flex items-center h-full ml-5 hover:border-b-[2px] hover:border-violet-400 hover:text-violet-400 ${togglePortfolioDescriptionStyle} hover:duration-200`}
                  onClick={() => handlePortfolioText('description')}>
                  <MdDescription className="mr-2 size-[20px]" />
                  Description
                  </li>
                  <li className={`flex items-center h-full ml-5 hover:border-b-[2px] hover:border-violet-400 hover:text-violet-400 ${togglePortfolioCommentStyle} hover:duration-200`}
                  onClick={() => handlePortfolioText('comment')}>
                  <MdComment className="mr-2 size-[20px]" />
                  Comment
                  </li>
                </ul>
                <div className="w-full h-full p-5">
                  <textarea className="w-full h-full border border-slate-300 rounded-md outline-none p-3" disabled={true}
                   value={portfolioTextId === 'comment' ? responsePortfolio.comment : responsePortfolio.description}> 
                  </textarea>
                </div>
              </div>
            </div>
            <div className="w-full h-[300px] flex justify-between items-center mt-7">
              <div className="w-[47.5%] h-full border shadow-lg flex justify-center items-center rounded-lg">
                <PortfolioProfitChart positiveTrade = {average_positive_trade} negativeTrade = {average_negative_trade} />
              </div>
              <div className="w-[47.5%] h-full border shadow-lg flex justify-center items-cente rounded-lg">
                <PortfolioCountChart win = {win_rate} />
              </div>
            </div>
            <div className="w-full h-[400px] flex justify-between items-center mt-7">
              <div className="w-[47.5%] h-full border shadow-lg flex flex-col rounded-lg">
                <span className="ml-3 mt-3 font-bold text-xl">Trading</span>
                <div className="border-2 border-slate-200 border-dashed mt-3 mx-3"></div>
                <div className="flex items-center mt-3 px-3 text-sm text-slate-600">
                  <div className="w-3/5 border bg-slate-100 shadow-lg rounded text-center mr-1">Content</div>
                  <div className="w-2/5 border bg-slate-100 shadow-lg rounded text-center ml-1">Value</div>
                </div>
                <div className="w-full h-full p-3 flex">
                  <div className="w-3/5 mr-1 shadow-lg rounded border flex flex-col justify-evenly items-start font-bold text-sm pl-2">
                    <div>Initial Capital</div>
                    <div>Final Capital</div>
                    <div>Total Trade Count</div>
                    <div>Positive Trade Count</div>
                    <div>Negative Trade Count</div>
                    <div>Average Trade Period</div>
                    <div>Average Positive Trade</div>
                    <div>Average Negative Trade</div>
                  </div>
                  <div className="w-2/5 ml-1 shadow-lg rounded border flex flex-col justify-evenly items-center font-bold">
                    <div>{initial_capital}</div>
                    <div>{final_capital}</div>
                    <div>{total_trade_count}</div>
                    <div>{positive_trade_count}</div>
                    <div>{negative_trade_count}</div>
                    <div>{average_trade_period}</div>
                    <div>{average_positive_trade}</div>
                    <div>{average_negative_trade}</div>
                  </div>
                </div>
              </div>
              <div className="w-[47.5%] h-full border shadow-lg flex flex-col rounded-lg">
                <span className="ml-3 mt-3 font-bold text-xl">Performance</span>
                <div className="border-2 border-slate-200 border-dashed mt-3 mx-3"></div>
                <div className="flex items-center mt-3 px-3 text-sm text-slate-600">
                  <div className="w-3/5 border bg-slate-100 shadow-lg rounded text-center mr-1">Content</div>
                  <div className="w-2/5 border bg-slate-100 shadow-lg rounded text-center ml-1">Value</div>
                </div>
                <div className="w-full h-full p-3 flex">
                  <div className="w-3/5 mr-1 shadow-lg rounded border flex flex-col justify-evenly items-start font-bold text-sm pl-2">
                    <div>Total Rate</div>
                    <div>Win Rate</div>
                    <div>Loss Rate</div>
                    <div>Win Loss Ratio</div>
                    <div>High Value Strategy</div>
                    <div>Low Value Strategy</div>
                    <div>High Loss Value Strategy</div>
                    {/* <div>Average Negative Trade</div> */}
                  </div>
                  <div className="w-2/5 ml-1 shadow-lg rounded border flex flex-col justify-evenly items-center font-bold">
                    <div>{total_rate}</div>
                    <div>{win_rate}</div>
                    <div>{loss_rate}</div>
                    <div>{win_loss_ratio}</div>
                    <div>{high_value_strategy}</div>
                    <div>{low_value_strategy}</div>
                    <div>{high_loss_value_strategy}</div>
                    {/* <div>{average_negative_trade}</div> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-[300px] border flex justify-between items-center p-5 mt-5">
              <div className="w-full h-full border shadow-lg flex justify-center items-center">
                딥러닝 차트
              </div>
            </div>
            <div className="w-full h-[300px] border flex justify-between items-center p-5 mt-5">
              <div className="w-full h-full border shadow-lg flex justify-center items-center">
                자동 구매 약관 동의
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
