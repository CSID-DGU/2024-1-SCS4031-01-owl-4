import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FaRegQuestionCircle } from "react-icons/fa";
import useResponseStore from "../utils/useResponseStore";

const StartFirstSettingForm = () => {
  const [isAllChecked, setAllChecked] = useState(false);
  const [isPersonalPassChekced, setPersonalPassChecked] = useState(false);
  const [isServiceChecked, setServiceChecked] = useState(false);
  const [isPersonalInfoChecked, setPersonalInfoChecked] = useState(false);
  const {isChecked, setIsChecked, isppc, issc, ispic, setIsPPC, setIsPIC, setIsSC } =
    useResponseStore();

  useEffect(() => {
    if (isppc && issc && ispic) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [
    ispic,
    issc,
    isppc,
    setIsChecked,
    setIsPPC,
    setIsPIC,
    setIsSC,
  ]);

  console.log(isChecked);
  return (
    <div className="w-full h-full flex flex-col">
      <div>
        <span className="font-bold text-sm text-slate-400">
          서비스 이용을 위해
        </span>
        <h1 className="font-bold text-lg mt-1">아래의 약관에 동의해주세요.</h1>
      </div>
      <div className="mt-4 flex items-center p-1">
        <div
          className={`size-[20px] rounded-full cursor-pointer flex justify-center items-center p-1 ${
            isAllChecked ? "bg-violet-600" : "border-2 border-slate-400"
          }`}
          onClick={() => {
            setAllChecked(!isAllChecked);
            if (!isAllChecked) {
              setServiceChecked(true);
              setPersonalInfoChecked(true);
              setPersonalPassChecked(true);
              setIsPPC(!isPersonalPassChekced);
              setIsPIC(!isPersonalInfoChecked);
              setIsSC(!isServiceChecked);
            } else {
              setServiceChecked(false);
              setPersonalInfoChecked(false);
              setPersonalPassChecked(false);
              setIsPPC(!isPersonalPassChekced);
              setIsPIC(!isPersonalInfoChecked);
              setIsSC(!isServiceChecked);
            }
          }}
        >
          {isAllChecked ? <FaCheck className="text-white" /> : ""}
        </div>
        <h1 className="font-bold ml-3 text-lg select-none">전체 동의</h1>
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-slate-400 font-bold select-none">
          전체동의는 BAMOWL 서비스의 동의를 포함하고 있습니다.
        </span>
        <span className="text-xs text-slate-400 font-bold select-none">
          전체 동의는 선택목적에 대한 동의를 포함하지 않으며
        </span>
        <span className="text-xs text-slate-400 font-bold select-none">
          동의 거부 시 서비스 이용이 불가합니다.
        </span>
      </div>
      <div className="mt-5">
        <div
          className="w-full cursor-pointer relative rounded-lg border border-slate-400 p-3 font-bold text-sm flex items-center group hover:border hover:border-violet-400"
          onClick={() => {
            setServiceChecked(!isServiceChecked);
            setIsSC(isServiceChecked);
          }}
        >
          <div
            className={`size-[15px] rounded-full cursor-pointer flex justify-center items-center p-1 
                ${
                  issc
                    ? ""
                    : "group-hover:border-2 group-hover:border-violet-400"
                } 
                ${issc ? "bg-violet-600" : "border-2 border-slate-400"}`}
          >
            {issc ? <FaCheck className="text-white" /> : ""}
          </div>
          <a className={`ml-3 group-hover:text-violet-400 select-none`} href="https://plip.kr/pcc/8cee2838-0d64-4001-a358-6a21e46c9e1d/consent/2.html" target="_blank">
            BAMOWL 서비스 이용에 대한 약관동의
          </a>
          <FaRegQuestionCircle className="size-[15px] absolute z-10 top-[33%] left-[50%] text-slate-400" />
        </div>
        <div
          className="w-full mt-3 cursor-pointer relative rounded-lg border border-slate-400 p-3 font-bold text-sm flex items-center group hover:border hover:border-violet-400"
          onClick={() => {
            setPersonalInfoChecked(!isPersonalInfoChecked);
            setIsPIC(isPersonalInfoChecked);
          }}
        >
          <div
            className={`size-[15px] rounded-full cursor-pointer flex justify-center items-center p-1 
                ${
                  ispic
                    ? ""
                    : "group-hover:border-2 group-hover:border-violet-400"
                } 
                ${ispic ? "bg-violet-600" : "border-2 border-slate-400"}`}
          >
            {ispic ? <FaCheck className="text-white" /> : ""}
          </div>
          <a className={`ml-3 group-hover:text-violet-400 select-none`} href="https://plip.kr/pcc/8cee2838-0d64-4001-a358-6a21e46c9e1d/consent/3.html" target="_blank">
            개인정보 수집 및 이용에 대한 약관동의
          </a>
          <FaRegQuestionCircle className="size-[15px] absolute z-10 top-[33%] left-[50%] text-slate-400" />
        </div>
        <div
          className="w-full mt-3 cursor-pointer relative rounded-lg border border-slate-400 p-3 font-bold text-sm flex items-center group hover:border hover:border-violet-400"
          onClick={() => {
            setPersonalPassChecked(!isPersonalPassChekced);
            setIsPPC(isPersonalPassChekced);
          }}
        >
          <div
            className={`size-[15px] rounded-full cursor-pointer flex justify-center items-center p-1 
                ${
                  isppc
                    ? ""
                    : "group-hover:border-2 group-hover:border-violet-400"
                } 
                ${isppc ? "bg-violet-600" : "border-2 border-slate-400"}`}
          >
            {isppc ? <FaCheck className="text-white" /> : ""}
          </div>
          <a className={`ml-3 group-hover:text-violet-400 select-none`} href="https://plip.kr/pcc/8cee2838-0d64-4001-a358-6a21e46c9e1d/privacy/1.html" target="_blank">
            개인정보 처리 및 위탁에 대한 약관동의
          </a>
          <FaRegQuestionCircle className="size-[15px] absolute z-10 top-[33%] left-[50%] text-slate-400" />
        </div>
      </div>
    </div>
  );
};

export default StartFirstSettingForm;

