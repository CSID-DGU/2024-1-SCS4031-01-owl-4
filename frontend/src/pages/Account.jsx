import png from "/src/assets/logo.svg";
import { useForm, FormProvider } from "react-hook-form";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useMultistepForm } from "../utils/useMultistepForm.jsx";
import useTokenStore from "../utils/token.js";
import { MdArrowForwardIos } from "react-icons/md";
import StartFirstSettingForm from "../components/StartFirstSettingForm.jsx";
import StartSecondSettingForm from "../components/StartSecondSettingForm.jsx";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import useResponseStore from "../utils/useResponseStore.js";
import { useState, useEffect } from "react";
import Modal from '../components/Modal.jsx'
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const formSchema = z.object({
  access_key: z.string().nonempty({ message: "Access Key is required" }),
  secret_key: z.string().nonempty({ message: "Secret Key is required" }),
});

const Account = () => {
  const {isChecked, setErrKeyState, setShowAPI, setShowAPISecret, setErrIpState} = useResponseStore();
  const navigate = useNavigate();
  const { token } = useTokenStore();
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const methods = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const { formState } = methods;
  const { isSubmitting, isSubmitted, isSubmitSuccessful } = formState;
  const { steps, step, currentStepIndex, isFirstStep, isLastStep, back, next } =
    useMultistepForm([<StartFirstSettingForm />, <StartSecondSettingForm />]);

  const mutationData = useMutation({
    mutationFn: async (data) => {
      const response1 =await axios.post("http://localhost:8081/api/v1/users/agreement","",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const response2 = await axios.post("http://localhost:8081/api/v1/users/upbit-keys",data,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return {response1, response2}
    },
    onSuccess : () => {
      navigate("/dashboard")
    },
    onError: (err) => {
      const message = err.response.data.message
      if(message === '올바른 업비트 키가 아닙니다.') {
        setErrKeyState(true)
        setShowAPI(true)
        setShowAPISecret(true)
      }
      if(message === '허용되지 않은 IP 주소입니다.') {
        setErrIpState(true)
        setShowAPI(true)
        setShowAPISecret(true)
      }
    }
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const response =await axios.post("http://localhost:8081/api/v1/users/agreement","",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response
    },
    onSuccess : () => {
      navigate("/dashboard")
    }
  })

  useEffect(() => {
    let timer;
  
    if (open) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }
  
    return () => {
      clearInterval(timer);
    };
  }, [open]);
  
  useEffect(() => {
    if (countdown === 0) {
      setOpen(false);
      setCountdown(3);
    }
    if(!open) {
      setCountdown(3);
    }
  }, [countdown,open]);

  const onSubmit = (data) => {
    if(isChecked) mutationData.mutate(data)
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-400">
      <main className="w-2/5 h-4/5 m-auto px-6 text-gray-500 bg-white rounded-xl shadow-xl relative">
        {currentStepIndex+1 === 2 ? <button className="absolute top-5 right-8 text-slate-400" 
        onClick={() => {
          if(isChecked) mutation.mutate()
          else {
        setOpen(true)
        }
          }}>건너뛰기 →
          </button>
          :""}
        <div className="mt-14 mx-5 flex flex-col">
          <div className="size-[70px] flex border-2 rounded-full justify-center items-center p-[6px] border-orange-300">
            <img src={png} alt="logo" className="size-[60px] rounded-md p-1" />
          </div>

          <div className="mt-5 px-1 flex flex-col">
            <h1 className="font-bold text-2xl">BAMOWL</h1>
            <span className="font-bold text-lg mt-1">
              서비스에 오신 것을 환영합니다.
            </span>
          </div>
          <div className="mt-7 px-1 flex w-full justify-center items-center">
            <div className={`rounded-full text-base font-bold border-2 py-2 px-3 ${currentStepIndex+1 === 1 ? "border-violet-600 text-violet-600":""} ${currentStepIndex+1 === 2 && isChecked ? "border-green-500 text-green-500": "border-red-500 text-red-500"}}`}>
              <span className={`${currentStepIndex+1 === 1 ? "border-violet-600 text-violet-600":""} ${currentStepIndex+1 === 2 && isChecked ? "text-green-500": "text-red-500"}`}>1</span>
            </div>
            <MdArrowForwardIos className={`size-[30px] ml-5 ${currentStepIndex+1 === 1 ? "text-violet-600":""} ${currentStepIndex+1 === 2 && isChecked ? "border-green-500 text-green-500": "border-red-500 text-red-500"}`} />
            <div className={`rounded-full text-base font-bold border-2 py-2 px-3 ml-5 ${currentStepIndex+1 === 2 ? "border-violet-600 text-violet-600":""} ${currentStepIndex+1 === 1 ? "border-slate-400 text-slate-400":""}`}>
              2
            </div>
          </div>

          <div className="w-full h-[400px] mt-5">
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="flex flex-col relative h-full"
              >
                {step}

                <div className="flex justify-evenly mt-5">
                  {!isFirstStep && (
                    <button
                      type="button"
                      onClick={back}
                      className="group flex items-center justify-start w-11 h-11 bg-violet-500 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
                    >
                      <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                        <FaRegArrowAltCircleLeft className="text-white size-[20px]" />
                      </div>
                      <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                        BACK
                      </div>
                    </button>
                  )}
                  <button
                    disabled={isSubmitting}
                    type="button"
                    onClick={isLastStep ?() => {
                      if(isChecked) methods.handleSubmit(onSubmit)
                        else {
                          setOpen(true)
                        }
                      } : next}
                    className={`group flex items-center justify-start w-11 h-11 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1 ${
                      isSubmitting ? "bg-slate-500" : "bg-violet-500"
                    }`}
                  >
                    <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                      {isLastStep ? (
                        <IoIosSend className="text-white size-[20px]" />
                      ) : (
                        <FaRegArrowAltCircleRight className="text-white size-[20px]" />
                      )}
                    </div>
                    <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      {isLastStep ? "SUBMIT" : "NEXT"}
                    </div>
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </main>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="w-[350px] h-[150px] relative flex flex-col justify-center items-center p-5">
          <h1 className="font-bold text-xl text-red-500 select-none">
            Terms not accepted
          </h1>
          <div className="flex items-center cursor-pointer mt-3 relative">
            <span className="select-none font-bold opacity-60" onClick={() => setOpen(false)}>Go back</span>
            <MdOutlineKeyboardDoubleArrowRight className="animate-ping ml-3 text-red-500" />
          </div>
          <p className="text-xs absolute bottom-0 right-0 text-slate-400 mt-2">
          Closes in <span className="font-bold text-slate-600 select-none">{countdown}</span> seconds
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Account;


