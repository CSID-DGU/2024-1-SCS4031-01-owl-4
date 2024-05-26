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
  const {setResponseBackTest} = useResponseStore();
  const token = 'eyJhbGciOiJIUzM4NCJ9.eyJ1c2VySWQiOiIxNTlmNDU0Mi1lYmZmLTRhY2QtYTYwMy1hNGZiNGM5NDUyNmMiLCJpYXQiOjE3MTYzMDAyOTEsImV4cCI6MTcyMTEwMDI5MX0.Vyf48RAXt3Eoxg5iTN3oON_hcYnEHB4octStoJlrE5Y0owYoz7OL0Nv4RlrnNe4q'

  console.log(token)

  const methods = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onBlur'
  });
  
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
      navigate('/dashboard/run');
    },
    onError: () => {
      console.log('에러')
    }
  })

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
          <form onSubmit={methods.handleSubmit(onSubmit)} className='flex flex-col relative h-full bg-amber-200 rounded-xl p-5'>
            
            {step}

            <div className="flex justify-evenly mt-10">
              {!isFirstStep && <button type="button" onClick={back}>Back</button>}
              <button type="button" onClick={isLastStep ? methods.handleSubmit(onSubmit) : next}>
                {isLastStep ? "Finish" : "Next"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  )
}

export default StrategySetting