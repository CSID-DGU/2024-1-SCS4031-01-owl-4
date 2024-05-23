import { useFormContext, Controller } from 'react-hook-form';
import { DatePicker } from "antd";

import { IoIosArrowDown } from "react-icons/io";
import { BiSolidDollarCircle } from "react-icons/bi";
import { PiCurrencyKrwFill } from "react-icons/pi";
import { useState } from 'react';

const { RangePicker } = DatePicker;

const FirstSettingForm = () => {
  const { register, formState: { errors }, control, setValue } = useFormContext();
  const [selectFundToggle, setSelectFundToggle] = useState(false);
  const [selectCurrency, setSelectCurrency] = useState('');


  const fundToggle = () => {
    setSelectFundToggle(!selectFundToggle)
  }

  const handleCurrency = (currency) => {
    setSelectCurrency(currency)
    setSelectFundToggle(false)
  }

  const fundToggleStyle = selectFundToggle ? "rotate-180" : ""

   const getInputErrorStyle = (field) => {
    return errors[field] ? "border-red-600 text-red-600 placeholder-shown:border-red-600 placeholder-shown:border-red-600 focus:text-black" : "border-black text-black placeholder-shown:border-black placeholder-shown:border-t-black";
  };

  const getLabelErrorStyle = (field) => {
    return errors[field] ? "before:border-red-600 after:border-red-600 text-red-600" : "before:border-black after:border-black text-black";
  };

  return (
    <>
      <div className='w-full text-center font-bold text-xl text-black'>
        <h1>Before Starting BackTesting</h1>
        <p className='font-normal text-sm text-justify m-3'>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam nesciunt, quasi debitis excepturi ratione laborum fugit delectus? Rerum quis id dolore facilis repellat consectetur, sint accusamus nulla sed totam eum.
        </p>
      </div>

      <div className='border-[0.5px] border-black border-dashed opacity-30'></div>

      <div className='w-full text-center font-bold text-lg text-black mt-5'>
        <h1>Manual</h1>
      </div>

      <div className="relative w-1/2 min-w-[200px] h-10 mt-5">
        <input
          className={`peer w-full h-full px-3 py-2.5 bg-transparent border-t-transparent rounded-[7px] text-sm font-bold outline-none transition-all 
          focus:outline-none focus:border-2 focus:border-purple-500 focus:border-t-transparent focus:bg-white
          disabled:bg-blue-gray-50 disabled:border-0 
          placeholder-shown: border ${getInputErrorStyle('title')}`}
          placeholder=""
          {...register('title')}
        />
        <label
          className={`flex w-full h-full ${getLabelErrorStyle('title')} select-none pointer-events-none absolute left-0 font-bold !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] peer-focus:text-purple-500 peer-focus:before:!border-purple-500 peer-focus:after:!border-purple-500`}>
          {errors['title'] ? "Title Error" : "Title"}
        </label>
      </div>

      <div className="relative w-full min-w-[200px] mt-5">
        <textarea
          className={`${getInputErrorStyle('description')} peer h-full min-h-[100px] focus:bg-white w-full resize-none rounded-[7px] border border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal outline outline-0 transition-all placeholder-shown:border focus:border-2 focus:border-purple-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50`}
          placeholder=" "
          {...register('description')}
        ></textarea>
        <label
          className={`${getLabelErrorStyle('description')} pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-bold leading-tight transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-purple-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-purple-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-purple-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500`}>
          {errors['description'] ? "Description Error" : "Description"}
        </label>
      </div>

      <div className='flex mt-5'>
        <div className="relative w-2/3 min-w-[200px] h-10">
          <input
            className={`peer w-full h-full px-3 py-2.5 bg-transparent border-t-transparent rounded-[7px] text-sm font-bold outline-none transition-all 
            focus:outline-none focus:border-2 focus:border-purple-500 focus:border-t-transparent  focus:bg-white
            disabled:bg-blue-gray-50 disabled:border-0 
            placeholder-shown: border custom-forms-no-arrows ${getInputErrorStyle('initial_capital')}`}
            placeholder=""
            type='number'
            {...register('initial_capital')}
          />
          <label
            className={`flex w-full h-full ${getLabelErrorStyle('initial_capital')} select-none pointer-events-none absolute left-0 font-bold !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] peer-focus:text-purple-500 peer-focus:before:!border-purple-500 peer-focus:after:!border-purple-500`}>
            {errors['initial_capital'] ? "Funds Error" : "Funds"}
          </label>
        </div>
        <div className='relative w-1/3 ml-2'>
          <div className={`flex w-full h-10 p-1 bg-transparent border border-black text-[10px] font-bold justify-between items-center cursor-pointer rounded-lg ${selectFundToggle ? "bg-white": ""}`} onClick={fundToggle}>
            {selectCurrency ? <span className='w-full text-center'>{selectCurrency}</span> : <span>Select your currency</span>}
            <IoIosArrowDown className={`${fundToggleStyle}`} />
          </div>
          {
            selectFundToggle &&
            <ul className='absolute w-full px-2 py-2 mt-2 rounded-lg bg-white z-50'>
              <li className='flex h-10 cursor-pointer py-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200' onClick={() => handleCurrency('USD')}>
                <BiSolidDollarCircle className='size-5' />
                <span className='font-bold'>USD</span>
              </li>
              <li className='flex h-10 cursor-pointer py-2 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200' onClick={() => handleCurrency('KRW')}>
                <PiCurrencyKrwFill className='size-5' />
                <span className='font-bold'>KRW</span>
              </li>
            </ul>
          }
        </div>
      </div>
        
        <div className="relative w-1/2 min-w-[200px] h-10 mt-5">
        <select
        className={`peer w-full h-full px-3 py-2.5 bg-transparent border-t-transparent rounded-[7px] text-sm font-bold outline-none transition-all 
        focus:outline-none focus:border-2 focus:border-purple-500 focus:border-t-transparent focus:bg-white
        disabled:bg-blue-gray-50 disabled:border-0 
        placeholder-shown: border ${getInputErrorStyle('candle_name')}`}
        placeholder="" {...register('candle_name')}>
          <option value="none" className='text-center'>===Select Candle===</option>
          <option value="minutes1">1_minutes</option>
          <option value="minutes3">3_minutes</option>
          <option value="minutes5">5_minutes</option>
          <option value="minutes10">10_minutes</option>
          <option value="minutes15">15_minutes</option>
          <option value="minutes30">30_minutes</option>
          <option value="minutes60">1_hour</option>
          <option value="minutes240">4_hour</option>
          <option value="days">days</option>
          <option value="weeks">weeks</option>
          <option value="months">months</option>
        </select>
        <label className={`flex w-full h-full ${getLabelErrorStyle('candle_name')} select-none pointer-events-none absolute left-0 font-bold !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] peer-focus:text-purple-500 peer-focus:before:!border-purple-500 peer-focus:after:!border-purple-500`}>
            {errors['candle_name'] ? "Candle Error": "Candle"}
        </label>
        </div>
        
      <Controller
      name="dateRange"
      control={control}
      render={({ field }) => (
        <RangePicker
          showTime
          className="h-10 mt-5 bg-transparent border border-black font-bold text-black"
          value={field.value ? [field.value[0], field.value[1]] : []}
          onChange={(dates) => {
            if (dates) {
              const startDate = dates[0].toISOString().split('.')[0];
              const endDate = dates[1].toISOString().split('.')[0];
              setValue('start_date', startDate);
              setValue('end_date', endDate);
            } else {
              setValue('start_date', '');
              setValue('end_date', '');
            }
            field.onChange(dates);
          }}
        />
      )}
    />
        
    </>
  );
}

export default FirstSettingForm;

 {/* <div>
        <label>Title</label>
        <input {...register("title")} />
        {errors.title && <p>{errors.title.message}</p>}
      </div> */}

      {/* <div>
        <label>Description</label>
        <textarea {...register("description")} />
        {errors.description && <p>{errors.description.message}</p>}
      </div> */}

    //   <div>
    //     <label>Funds</label>
    //     <input type="number" {...register("funds")} />
    //     {errors.funds && <p>{errors.funds.message}</p>}
    //   </div>

    //   <div>
    //     <label>Timeframe</label>
    //     <input {...register("timeframe")} />
    //     {errors.timeframe && <p>{errors.timeframe.message}</p>}
    //   </div>

    //   <div>
    //     <label>Start Date</label>
    //     <input type="date" {...register("startDate")} />
    //     {errors.startDate && <p>{errors.startDate.message}</p>}
    //   </div>

    //   <div>
    //     <label>End Date</label>
    //     <input type="date" {...register("endDate")} />
    //     {errors.endDate && <p>{errors.endDate.message}</p>}
    //   </div>



