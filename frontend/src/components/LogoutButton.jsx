import {faPowerOff} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react';
import { Link } from "react-router-dom";

const LoginButton = () => {
  const [up, setUp] = useState(0);
  const [left, setLeft] = useState(0);

  const handleMouseOver = (e) => {
    setUp(e.pageX - e.currentTarget.offsetLeft);
    setLeft(e.pageY - e.currentTarget.offsetTop);
    e.currentTarget.style.setProperty('--x', `${up}px`);
    e.currentTarget.style.setProperty('--y', `${left}px`);
  };

  return (

    <Link to="/login" className="w-[100px] h-[45px] relative bg-[#222] opacity-60 rounded-2xl text-center leading-[45px] text-white overflow-hidden group 
    after:absolute after:top-[var(--y)] after:left-[var(--x)] after:translate-x-[-50%] after:translate-y-[-50%] after:w-0 after:h-0 after:bg-red-600 after:rounded-full
    after:ease-out after:duration-[0.5s] hover:after:w-[300px] hover:after:h-[300px]" onMouseOver={handleMouseOver}>
      <FontAwesomeIcon icon={faPowerOff} className='absolute top-[50%] left-[50%] z-[99] translate-x-[-50%] translate-y-[-50%] opacity-0 transition-opacity duration-[0.4s]
       group-hover:opacity-100 group-hover:transition-opacity group-hover:duration-[0.4s] group-hover:delay-[0.15s]' />
      <p className='relative tracking-wider pointer-events-none transition-opacity font-bold duration-[0.4s] delay-[0.15s]
      group-hover:opacity-0 group-hover:transition-opacity group-hover:duration-[0.4s]'>Logout</p>
    </Link>
  )
}

export default LoginButton