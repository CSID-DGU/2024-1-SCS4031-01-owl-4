import { useFormContext } from 'react-hook-form';
import { MdOutlineErrorOutline } from "react-icons/md";
import { MdOutlineDescription } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import { useState } from 'react';
import useResponseStore from '../utils/useResponseStore';


const FirstSettingForm = () => {
  const { register, formState: { errors }} = useFormContext();
  const {description, title, setTitle,setDescription}= useResponseStore();
  
  return (
    <>
      <div className='w-full h-[25%] shadow-lg rounded-lg border'>
        <div className='w-full h-1/4 bg-indigo-500 px-3 text-lg rounded-t-lg font-bold py-1 text-white'>
          <h1>Before Starting BackTest</h1>
        </div>
        <div className='w-full h-3/4 text-sm rounded-b-lg px-3 py-2'>
          <p className='font-bold text-black leading-6'>
          가상화폐 포트폴리오 백테스팅 전략 설정에 오신 것을 환영합니다.  
          백테스팅은 과거 데이터를 통해 전략의 유효성과 리스크를 검증하는 과정입니다. 
          이는 전략의 신뢰성을 평가하고, 객관적인 투자 결정을 돕는 동시에, 시장 변화에 대한 대응력을 높여줍니다. 
          </p>
        </div>
      </div>
      <div className='w-full h-[75%] mt-3 shadow-lg rounded-lg border'>
        <div className='w-full bg-violet-500 px-3 text-lg rounded-t-lg font-bold py-2 text-white'>
          <h1>Manual</h1>
        </div>
        <div className='w-full h-full flex flex-col p-3'>

          <h1 className='font-bold text-slate-400'>Title</h1>

          <div className='w-2/3 relative transition-all'>

            <input type="text" className={`peer outline-none mt-2 w-full border-[1.5px] rounded-lg pl-10 py-2 duration-300 
              ${errors['title'] || title.length ? '' : 'border-slate-400 bg-slate-50 hover:border-violet-500 focus:border-violet-500 focus:bg-white'} 
              ${!title.length ? 'border-red-500':'border-green-500 focus:border-green-500 bg-white focus:bg-white'}`} 
              {...register('title')} 
              onChange={(e) => setTitle(e.target.value)}
              value={title} 
              maxLength={10} />

            <div className={`absolute left-2 top-4 size-[25px] rounded-full border-[1.5px] flex items-center justify-center font-bold text-lg 
              ${errors['title'] || title.length ? '' : 'border-slate-400 text-slate-400 peer-focus:border-violet-500 peer-focus:text-violet-500 peer-hover:border-violet-500 peer-hover:text-violet-500'} 
              ${!title.length ? 'border-red-500 text-red-500':'border-green-500 text-green-500 peer-focus:border-green-500 peer-focus:text-green-500'}`}>
              T
            </div>
            <MdOutlineErrorOutline className={`absolute top-5 right-3 duration-300 ${errors['title'] ? '': 'text-transparent'} ${!title.length ? 'text-red-500':'text-transparent'}`} /> 
            <FaRegCheckCircle className={`absolute top-5 right-3 duration-300 ${title.length ? 'text-green-500' : 'text-transparent'}`} />
          </div>

          <h1 className='mt-3 text-slate-400 font-bold text-lg'>Description</h1>
          
          <div className='w-full relative transition-all h-[60%] mt-2'>
            
            <textarea className={`peer w-full h-full outline-none p-3 rounded-lg duration-300 border-[1.5px]
              ${errors['description'] || description.length ? '' : 'border-slate-400 bg-slate-50 hover:border-violet-500 focus:border-violet-500 focus:bg-white'} 
              ${!description.length ? 'border-red-500':'border-green-500 focus:border-green-500 bg-white focus:bg-white'}`}
              {...register('description')}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={150}
              value={description} />
              <div className='absolute bottom-3 right-5 text-slate-400'>{description.length}/150</div>
              {description.length ? "" : <MdOutlineDescription className={`absolute top-[45%] left-[45%] size-[30px] peer-focus:invisible ${errors['description']? "text-red-500" : "text-slate-400" }`} />}
          </div>

        </div>
        
      </div>
      
    </>
  );
}

export default FirstSettingForm;