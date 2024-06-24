import Modal from '../components/Modal'
import { FaSearch } from "react-icons/fa";
import Markets from "../components/Markets";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10;

const MarketModal = ({ open, setOpen }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsData, setItemsData] = useState([]);

  const { data: marketData } = useQuery({
    queryKey: ["markets"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:8081/api/v1/charts/options"
      );
      return response.data.payload
        .filter(function (value, index) {
          return index === 0 || index % 11 === 0;
        })
        .map(function (value) {
          return value;
        });
    },
  });

  useEffect(() => {
    if (marketData) {
      setItemsData(marketData)
      const filteredData = itemsData.filter((item) => {
        return (
          item.english_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.korean_name.includes(searchQuery)
        );
      });
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      setPaginatedData(
        filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE)
      );
    }
  }, [itemsData, searchQuery, currentPage, marketData]);

  const handleSearchFilter = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(
    itemsData.filter((item) =>
      item.english_name.toLowerCase().includes(searchQuery.toLowerCase())
    ).length / ITEMS_PER_PAGE
  );

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="w-[800px] h-[600px] flex flex-col shadow-lg border rounded-lg">
        <div className="h-[12%] b flex justify-center items-center">
          <div className="w-[70%] border border-black rounded-lg flex items-center justify-center px-3">
            <FaSearch className="size-[20px] mr-2 " />
            <input
              type="text"
              className="w-full h-[35px] outline-none px-2"
              onChange={handleSearchFilter}
            />
          </div>
        </div>
        <div className="h-[88%] flex flex-col px-7 py-2">
          <div className="flex text-sm mb-3 px-3">
            <div className="w-[10%] text-center bg-slate-200 mr-2 p-1 rounded-lg font-bold text-slate-500">
              IMG
            </div>
            <div className="w-[73%] text-center bg-slate-200 ml-2 mr-2 p-1 rounded-lg font-bold text-slate-500">
              NAME
            </div>
            <div className="w-[17%] text-center bg-slate-200 ml-2 p-1 rounded-lg font-bold text-slate-500">
              UNIT
            </div>
          </div>
          {paginatedData.map((item) => (
            <Markets
              key={item.portfolio_id}
              item={item}
              close={() => setOpen(false)}
            />
          ))}
          <div className="flex justify-center absolute left-[15%] bottom-[6%]">
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
    </Modal>
  );
};

export default MarketModal;
