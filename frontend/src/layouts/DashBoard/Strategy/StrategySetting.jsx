import { useForm, FormProvider } from 'react-hook-form';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FirstSettingForm from "../../../components/FirstSettingForm.jsx";
import TwoSettingForm from "../../../components/TwoSettingForm.jsx";
import { useMultistepForm } from "../../../utils/useMultistepForm.jsx"
import { useMutation } from '@tanstack/react-query';
import useResponseStore from '../../../utils/useResponseStore.js'
import { useNavigate } from "react-router-dom";
import useTokenStore from '../../../utils/token.js';
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { useEffect } from 'react';
import Loading from '../../../components/Loading.jsx';

const formSchema = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  initial_capital: z.preprocess(
    (value) => parseFloat(value),
    z.number().positive({ message: "Funds must be a positive number" })
  ),
  candle_name: z.string().nonempty({ message: "Timeframe is required" }),
  start_date: z.string().nonempty({ message: "Start date is required" }).refine(
    (date) => !isNaN(Date.parse(date)),
    { message: "Start date must be a valid date" }
  ),
  end_date: z.string().nonempty({ message: "End date is required" }).refine(
    (date) => !isNaN(Date.parse(date)),
    { message: "End date must be a valid date" }
  ),
  m_date: z.preprocess(
    (value) => parseFloat(value),
    z.number().positive({ message: "m_MA must be a positive number" })
  ),
  a_date: z.preprocess(
    (value) => parseFloat(value),
    z.number().positive({ message: "n_MA must be a positive number" })
  ),
  trading_unit: z.preprocess(
    (value) => parseFloat(value),
    z.number().positive({ message: "Trading unit must be a positive number" })
  ),
  buying_point: z.preprocess(
    (value) => parseFloat(value),
    z.number().positive({ message: "Buying point must be a positive number" })
  ),
  selling_point: z.preprocess(
    (value) => parseFloat(value),
    z.number().positive({ message: "Selling point must be a positive number" })
  ),
  stop_loss_point: z.preprocess(
    (value) => parseFloat(value),
    z.number().positive({ message: "Stop loss point must be a positive number" })
  )
});

const StrategySetting = () => {
  const navigate = useNavigate();
  const {setResponseBackTest, setLoading} = useResponseStore();
  const {token} = useTokenStore();

  const methods = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onBlur'
  });
  
  const {formState, reset} = methods
  const {isSubmitting, isSubmitted, isSubmitSuccessful} = formState
  const {steps, step, currentStepIndex, isFirstStep, isLastStep, back, next} = useMultistepForm([<FirstSettingForm />, <TwoSettingForm />])
  
  const mutation = useMutation({
    mutationFn: async (data) => {
      console.log(data)
      const response = await axios.post('http://localhost:8081/api/v1/backtesting/run', data, {
        headers : {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${token}`
        }
      })
      console.log(response.data)
      setResponseBackTest(response.data)
    },
    onSuccess: () => {
      setLoading()
      reset();
      navigate('/dashboard/run');
    },
    onError: () => {
      console.log('에러')
    }
  })

  useEffect(() => {
    if(mutation.isPending){
      setLoading()
    }
  },[mutation.isPending, setLoading])
  
  const onSubmit = (data) => {
    mutation.mutate(data);
  };

 
  return (
    <>
      <div className="basis-[50px] rounded-t-xl flex relative">
        <div className="grow-[3] bg-white flex rounded-t-2xl justify-center items-center">
          <span className="block font-bold text-2xl">STEP {currentStepIndex + 1}</span>
        </div>
        <div className="grow-[1] flex justify-center items-center rounded-l-xl shadow-[-5px_5px_0_rgb(255,255,255)]">
        <span className="block w-2/3 bg-orange-500 font-bold text-white text-xl text-center rounded-xl">{currentStepIndex + 1} / {steps.length}</span>
        </div>
      </div>
      <div className="h-full bg-white rounded-b-xl rounded-r-xl p-5" >
      <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className='flex flex-col relative h-full bg-white rounded-xl p-5 shadow-xl border'>
            
            {step}

            <div className="flex justify-evenly mt-10">
              {
              
                !isFirstStep && 
                <button type='button' onClick={back} className="group flex items-center justify-start w-11 h-11 bg-violet-500 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1">
                <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                  <FaRegArrowAltCircleLeft className='text-white size-[20px]' />
                </div>
                <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                BACK
                </div>
              </button>
                // <button type="button" onClick={back} className=''>Back</button>
              }
              <button disabled={isSubmitting} type='button' onClick={isLastStep ? methods.handleSubmit(onSubmit) : next} className={`group flex items-center justify-start w-11 h-11 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1 ${isSubmitting? "bg-slate-500" : "bg-violet-500"}`}>
                <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                  {isLastStep? <IoIosSend className='text-white size-[20px]' /> : <FaRegArrowAltCircleRight className='text-white size-[20px]' />}
                </div>
                <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                {isLastStep ? "SUBMIT" : "NEXT"}
                </div>
              </button>

            </div>
          </form>
        </FormProvider>
      </div>
    </>
  )
}

export default StrategySetting


