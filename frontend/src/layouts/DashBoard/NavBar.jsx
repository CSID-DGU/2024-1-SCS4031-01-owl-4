import { Link } from "react-router-dom"
import png from '/src/assets/logo.svg';
import {LogoutButton, Profile, Switch, Search} from '../../components/index.js'
import useResponseStore from "../../utils/useResponseStore.js";

const NavBar = () => {
  
  const {username} = useResponseStore()
  
  return (
    <nav className="bg-white flex py-2 justify-center items-center">
        <div className="grow-[1] content-center ml-3">
        <Link className="flex gap-1 text-2xl font-bold font-heading items-center" to='.'>
        <img className="w-[35px] h-[35px]" src={png} alt="logo" />
          BAMOWL
        </Link>
        </div>
        <div className="flex grow-[2] items-center justify-between text-lg font-semibold">
        </div>
        <div className="grow-[15] content-center px-5 ml-4">
            <Search />
        </div>
        <div className='flex items-center gap-5'>
          <LogoutButton/>
        </div>
        <div className="text-left ml-5 mr-4 font-bold">
            <div>Hello {username}.</div>
            <div>Good Trading!!</div>
        </div>
        <div className="grow-[4] flex justify-center items-center">
            <Profile />
        </div>
        <div className="grow-[1] flex justify-center items-center">
            <Switch />
        </div>
    </nav>
  )
}

export default NavBar