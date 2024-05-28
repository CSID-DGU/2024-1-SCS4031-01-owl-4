import { useFormContext } from 'react-hook-form';

const TwoSettingForm = () => {
  const { register, formState: { errors} } = useFormContext();

  const getInputErrorStyle = (field) => {
    return errors[field] ? "border-red-600 text-red-600 placeholder-shown:border-red-600 placeholder-shown:border-red-600 focus:text-black" : "border-black text-black placeholder-shown:border-black placeholder-shown:border-t-black";
  };

  const getLabelErrorStyle = (field) => {
    return errors[field] ? "before:border-red-600 after:border-red-600 text-red-600" : "before:border-black after:border-black text-black";
  };

  return (
    <>
      <div className='w-full text-center font-bold text-xl text-black'>
        <h1>What is average down?</h1>
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
          placeholder-shown: border ${getInputErrorStyle('m_date')}`}
          placeholder="" type='number'
          {...register('m_date')}
        />
        <label
          className={`flex w-full h-full ${getLabelErrorStyle('m_date')} select-none text-sm pointer-events-none absolute left-0 font-bold !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] peer-focus:text-purple-500 peer-focus:before:!border-purple-500 peer-focus:after:!border-purple-500`}>
          {errors['m_date'] ? "Moving Average Error" : "M-Moving Average"}
        </label>
      </div>
      
      <div className="relative w-1/2 min-w-[200px] h-10 mt-5">
        <input
          className={`peer w-full h-full px-3 py-2.5 bg-transparent border-t-transparent rounded-[7px] text-sm font-bold outline-none transition-all 
          focus:outline-none focus:border-2 focus:border-purple-500 focus:border-t-transparent focus:bg-white
          disabled:bg-blue-gray-50 disabled:border-0 
          placeholder-shown: border ${getInputErrorStyle('n_date')}`}
          placeholder="" type='number'
          {...register('n_date')}
        />
        <label
          className={`flex w-full h-full ${getLabelErrorStyle('n_date')} select-none text-sm pointer-events-none absolute left-0 font-bold !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] peer-focus:text-purple-500 peer-focus:before:!border-purple-500 peer-focus:after:!border-purple-500`}>
          {errors['n_date'] ? "Moving Average Error" : "N-Moving Average"}
        </label>
      </div>

      <div className="relative w-1/2 min-w-[200px] h-10 mt-5">
        <input
          className={`peer w-full h-full px-3 py-2.5 bg-transparent border-t-transparent rounded-[7px] text-sm font-bold outline-none transition-all 
          focus:outline-none focus:border-2 focus:border-purple-500 focus:border-t-transparent focus:bg-white
          disabled:bg-blue-gray-50 disabled:border-0 
          placeholder-shown: border ${getInputErrorStyle('trading_unit')}`}
          placeholder="" type='number'
          {...register('trading_unit')}
        />
        <label
          className={`flex w-full h-full ${getLabelErrorStyle('trading_unit')} select-none text-sm pointer-events-none absolute left-0 font-bold !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] peer-focus:text-purple-500 peer-focus:before:!border-purple-500 peer-focus:after:!border-purple-500`}>
          {errors['trading_unit'] ? "Buying Split Error" : "Buying Split"}
        </label>
      </div>

      <div className="relative w-1/2 min-w-[200px] h-10 mt-5">
        <input
          className={`peer w-full h-full px-3 py-2.5 bg-transparent border-t-transparent rounded-[7px] text-sm font-bold outline-none transition-all 
          focus:outline-none focus:border-2 focus:border-purple-500 focus:border-t-transparent focus:bg-white
          disabled:bg-blue-gray-50 disabled:border-0 
          placeholder-shown: border ${getInputErrorStyle('selling_point')}`}
          placeholder="" type='number'
          {...register('selling_point')}
        />
        <label
          className={`flex w-full h-full ${getLabelErrorStyle('selling_point')} select-none text-sm pointer-events-none absolute left-0 font-bold !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] peer-focus:text-purple-500 peer-focus:before:!border-purple-500 peer-focus:after:!border-purple-500`}>
          {errors['selling_point'] ? "Selling condition Error" : "Selling condition"}
        </label>
      </div>

      <div className="relative w-1/2 min-w-[200px] h-10 mt-5">
        <input
          className={`peer w-full h-full px-3 py-2.5 bg-transparent border-t-transparent rounded-[7px] text-sm font-bold outline-none transition-all 
          focus:outline-none focus:border-2 focus:border-purple-500 focus:border-t-transparent focus:bg-white
          disabled:bg-blue-gray-50 disabled:border-0 
          placeholder-shown: border ${getInputErrorStyle('buying_point')}`}
          placeholder="" type='number'
          {...register('buying_point')}
        />
        <label
          className={`flex w-full h-full ${getLabelErrorStyle('buying_point')} select-none text-sm pointer-events-none absolute left-0 font-bold !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] peer-focus:text-purple-500 peer-focus:before:!border-purple-500 peer-focus:after:!border-purple-500`}>
          {errors['buying_point'] ? "Buying condition Error" : "Buying condition"}
        </label>
      </div>

      <div className="relative w-1/2 min-w-[200px] h-10 mt-5">
        <input
          className={`peer w-full h-full px-3 py-2.5 bg-transparent border-t-transparent rounded-[7px] text-sm font-bold outline-none transition-all 
          focus:outline-none focus:border-2 focus:border-purple-500 focus:border-t-transparent focus:bg-white
          disabled:bg-blue-gray-50 disabled:border-0 
          placeholder-shown: border ${getInputErrorStyle('stop_loss_point')}`}
          placeholder="" type='number'
          {...register('stop_loss_point')}
        />
        <label
          className={`flex w-full h-full ${getLabelErrorStyle('stop_loss_point')} select-none text-sm pointer-events-none absolute left-0 font-bold !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] peer-focus:text-purple-500 peer-focus:before:!border-purple-500 peer-focus:after:!border-purple-500`}>
          {errors['stop_loss_point'] ? "StopLossPoint Error" : "StopLossPoint"}
        </label>
      </div>      
      
    </>
  );
}

export default TwoSettingForm;
