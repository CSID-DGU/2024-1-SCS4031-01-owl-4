import { Link, useLocation} from 'react-router-dom';
import { AiTwotoneUpSquare } from "react-icons/ai"
import { IoMdSettings } from "react-icons/io";
import { BsGridFill } from "react-icons/bs";
import { MdCandlestickChart } from "react-icons/md";
import { TbTableFilled } from "react-icons/tb";
import { BsFillClipboard2PlusFill } from "react-icons/bs";
import { BsCpuFill } from "react-icons/bs";
import { BsClipboard2DataFill } from "react-icons/bs";

import { useState } from 'react';

const SideBar = () => {
  
  const location = useLocation().pathname;
  const path = location.split('/')[2];

  const [open, setOpen] = useState(true);
  const [link, setLink] = useState(path);

  const handleLink = (linkId) => {
    setLink(linkId);
  };

  const handleOpen = () => {
    setOpen(!open);

  }

  const navOpenStyle = open ? 'basis-[200px]' : 'basis-[100px]'
  const listOpenStyle = open ? 'hover:bg-amber-200' : 'hover:translate-x-[70%] hover:duration-[400ms] taransition-all'
  // const homeClickStyle = link === undefined ? 'bg-amber-200 bg-red-500' : '' 
  const openingToggleStyle = open ? 'translate-x-[200%] duration-[400ms] rotate-[-90deg]' : 'duration-[400ms]'
  const spanMenuStyle = open ? "" : "hidden"

  return (
    <div className={`${navOpenStyle} flex justify-center items-center transition-all duration-[400ms] ease-out`}>
      <div className='w-full h-[75%] flex flex-col justify-center items-center bg-amber-400 rounded-r-[100px]'>
          
          <div className='grow-[1] w-full flex items-center'>
            <AiTwotoneUpSquare onClick={handleOpen} className={`size-[40px] top-4 left-5 relative transition-all rotate-90 ease-out ${openingToggleStyle}`} />
          </div>

          <ul className='grow-[8] w-full flex flex-col pl-6 mt-6'>
            <li className={`w-full rounded-l-lg ${listOpenStyle}`}>
            <Link to="." className='relative w-full group' onClick={() => handleLink(undefined)}>
              <div className='size-[35px] flex justify-center items-center rounded-lg text-black group-hover:bg-red-500'>
                <BsGridFill className='size-[25px] relative top-0 left-0 group-hover:text-white' />
              </div>
              <span className={`ml-3 absolute top-1 left-8 ${spanMenuStyle} text-base text-black font-bold group-hover:text-red-600`}>HOME</span>
            </Link>
            </li>
            <li className='mt-4'>
            <Link to="chart" className='text-black relative w-full text-lg font-bold' onClick={() => handleLink(undefined)}>
              <MdCandlestickChart className='size-[30px] relative top-0 left-0' />
              <span className={`ml-3 absolute top-1 left-8 ${spanMenuStyle} text-base`}>CHART</span>
            </Link>
            </li>
            <li className='mt-4'>
            <Link to="table" className='text-black relative w-full text-lg font-bold' onClick={() => handleLink(undefined)}>
              <TbTableFilled className='size-[30px] relative top-0 left-0' />
              <span className={`ml-3 absolute top-1 left-8 ${spanMenuStyle} text-base`}>TABLE</span>
            </Link>
            </li>
            <li className='mt-4'>
            <Link to="strategy" className='text-black relative w-full text-lg font-bold' onClick={() => handleLink(undefined)}>
              <BsFillClipboard2PlusFill className='size-[30px] relative top-0 left-0' />
              <span className={`ml-3 absolute top-1 left-8 ${spanMenuStyle} text-base`}>STRATEGY</span>
            </Link>
            </li>
            <li className='mt-4'>
            <Link to="run" className='text-black relative w-full text-lg font-bold' onClick={() => handleLink(undefined)}>
              <BsCpuFill className='size-[30px] relative top-0 left-0' />
              <span className={`ml-3 absolute top-1 left-8 ${spanMenuStyle} text-base`}>RUN</span>
            </Link>
            </li>
            <li className='mt-4'>
            <Link to="portfolio" className='text-black relative w-full text-lg font-bold' onClick={() => handleLink(undefined)}>
              <BsClipboard2DataFill className='size-[30px] relative top-0 left-0' />
              <span className={`ml-3 absolute top-1 left-8 ${spanMenuStyle} text-base`}>PORTFOLIO</span>
            </Link>
            </li>
          </ul>

          <div className='grow-[1] w-full flex items-center'>
            <IoMdSettings onClick={handleOpen} className={`size-[30px] top-[-20px] left-6 relative`} />
          </div>


      </div>
      {/* <div className='bg-amber-400 absolute rounded-[100px] flex left-[-130.4px] h-full w-[300px]' />
      <div className='w-full h-full relative flex flex-col'>
        <div className='grow-[1] flex justify-center items-center'>
          <div className='flex flex-col gap-3'>
              <div className='w-[70px] h-[2px] rounded-full bg-black'></div>
              <div className='w-[70px] h-[2px] rounded-full bg-black'></div>
          </div>
          <AiTwotoneUpSquare className='size-[40px] rotate-[-90deg] relative left-[-10px]' />
        </div>
        <ul className='grow-[12] flex flex-col py-5'>
          <li className='pl-2'>
            <Link to="." className='text-black w-full relative flex items-center text-lg font-bold p-1 py-2 group `${}` hover:bg-slate-200 hover:rounded-l-md
             hover:after:absolute hover:after:h-[30px] hover:after:w-[30px] hover:after:bg-amber-400 hover:after:right-0 hover:after:bottom-[100%] hover:after:rounded-r-[10px] hover:after:shadow-[0_17px_0_rgb(226,232,240)]
             hover:before:absolute hover:before:h-[30px] hover:before:w-[30px] hover:before:bg-amber-400 hover:before:right-0 hover:before:top-[100%] hover:before:rounded-r-[10px] hover:before:shadow-[0_-17px_0_rgb(226,232,240)]' onClick={() => handleLink(undefined)}>
              <BsGridFill className='size-[20px] ml-2 group-hover:fill-orange-600' />
              <span className='text-base block ml-3 group-hover:text-orange-600'>HOME</span>
            </Link>
          </li>
          <li className='mt-5'>
            <Link to="chart" className='text-black relative flex items-center text-lg font-bold hover:bg-yellow-300 p-1 w-full' onClick={() => handleLink(undefined)}>
              <BsGridFill className='size-[20px] ml-4' />
              <span className='text-base block ml-3'>HOME</span>
            </Link>
          </li>
        </ul>
        <div className='grow-[1] flex items-center'>
            <IoMdSettings className='size-[25px] rotate-[-90deg] ml-7' />
        </div>
      </div> */}
      {/* <ul className='grow-[19] w-full flex flex-col'>

        <li className='relative overflow-hidden'>
          <Link to="." className='text-black relative flex text-lg font-bold bg-yellow-300 p-1' onClick={() => handleLink(undefined)}>
            <img src={Home} alt="home" className='size-[25px] ml-2' />
            <span className='absolute top-[7%] left-[30%] text-base'>Home</span>
          </Link>
          {link === undefined ? <div className='absolute h-[40px] top-[-10%] left-[88%] border-[10px] border-r-[10px] border-r-yellow-600 border-yellow-300'></div> : null}
        </li>
        <div className='mt-5 px-3 text-white'>Information</div>
        <li className='mt-2 relative overflow-hidden'>
          <Link to="chart" className='text-black relative flex text-lg font-bold bg-yellow-300 p-1' onClick={() => handleLink('chart')}>  
            <img src={Home} alt="chart" className='size-[25px] ml-2' />
            <span className='absolute top-[7%] left-[30%] text-base'>CHART</span>
          </Link>
          {link === 'chart' ? <div className='absolute h-[40px] top-[-10%] left-[88%] border-[10px] border-r-[10px] border-r-yellow-600 border-yellow-300'></div> : null}
        </li>

      </ul>


      <div className='grow-[1] w-full flex justify-center items-center text-black'>
        <div>Settings</div>
      </div> */}
    </div>
    
  );
};

export default SideBar;

{/* <div className='flex flex-col items-center py-5 w-[275px] h-[800px] bg-red-500 absolute top-0 left-[40%] mt-8'>

</div> */}