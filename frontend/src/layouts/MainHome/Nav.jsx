import { Link } from 'react-router-dom';
import { Link as LinkToScroll} from 'react-scroll'
import { LoginButton } from '../../components';
import png from '/src/assets/logo_dark.svg';
import {faBars} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Nav = () => {
  

  return (
    <header className='flex fixed top-0 w-full px-5 py-5 md:px-10'>
      <nav className='flex w-full justify-between items-center text-white'>
        <div>
        <Link className="flex gap-1 text-xl font-bold font-heading items-center" to='/'>
        <img className="w-[35px] h-[35px]" src={png} alt="logo" />
          BAMOWL
        </Link>  
        </div>
        <div>
        <ul className="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">
          <li className='group'>
            <LinkToScroll to='hero' spy={true} smooth={true} offset={-100} duration={500} className="relative text-[#333] py-2 px-5 duration-[.5s] hover:text-white cursor-pointer">HOME
              <span className='absolute top-0 left-0 w-full h-full z-[-1] border-b-2 border-b-white rounded-md scale-0 translate-y-[50px] opacity-0 duration-[.3s] group-hover:scale-100 group-hover:translate-y-0 group-hover:opacity-100'></span>
            </LinkToScroll>
          </li>
          <li className='group'>
            <LinkToScroll to='feature' spy={true} smooth={true} offset={-100} duration={500} className="relative text-[#333] py-2 px-5 duration-[.5s] hover:text-white cursor-pointer">FEATURE
              <span className='absolute top-0 left-0 w-full h-full z-[-1] border-b-2 border-b-white rounded-md scale-0 translate-y-[50px] opacity-0 duration-[.3s] group-hover:scale-100 group-hover:translate-y-0 group-hover:opacity-100'></span>
            </LinkToScroll>
          </li>
          <li className='group'>
            <LinkToScroll to='model' spy={true} smooth={true} offset={-100} duration={500} className="relative text-[#333] py-2 px-5 duration-[.5s] hover:text-white cursor-pointer">MODEL
              <span className='absolute top-0 left-0 w-full h-full z-[-1] border-b-2 border-b-white rounded-md scale-0 translate-y-[50px] opacity-0 duration-[.3s] group-hover:scale-100 group-hover:translate-y-0 group-hover:opacity-100'></span>
            </LinkToScroll>
          </li>
          <li className='group'>
          <LinkToScroll to='contact' spy={true} smooth={true} offset={-100} duration={500} className="relative text-[#333] py-2 px-5 duration-[.5s] hover:text-white cursor-pointer">CONTACT
              <span className='absolute top-0 left-0 w-full h-full z-[-1] border-b-2 border-b-white rounded-md scale-0 translate-y-[50px] opacity-0 duration-[.3s] group-hover:scale-100 group-hover:translate-y-0 group-hover:opacity-100'></span>
            </LinkToScroll>
          </li>
        </ul>
        </div>
        <div className='flex items-center gap-5'>
          <LoginButton/>
          <FontAwesomeIcon icon={faBars} className='md:hidden' />
        </div>
      </nav>
    </header>

      

  )
}

export default Nav