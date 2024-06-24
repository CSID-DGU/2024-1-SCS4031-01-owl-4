import { RxCross2 } from "react-icons/rx";

const Modal = ({open, onClose, children}) => {
  return (
    <div onClick={onClose} className={`fixed inset-0 z-50 flex justify-center items-center transition-colors
    ${open ? 'visible bg-black/20' : 'invisible'}`}>
        <div className={`bg-white rounded-xl shadow p-6 transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
        onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
            onClick={onClose}>
                <RxCross2 />
            </button>
            {children}
        </div>
    </div>
  )
}

export default Modal