import {Outlet } from 'react-router-dom'
import NavBar from '../layouts/DashBoard/NavBar'
import SideBar from '../layouts/DashBoard/SideBar'
import useTokenStore from '../utils/token'

const DashBoard = () => {

  const {token} = useTokenStore();

  return (
    <main className='h-screen flex flex-col'>
      <NavBar />
      <div className='h-full bg-slate-200 flex'>
      <SideBar />
      <Outlet />
      </div>
    </main>
  )
}

export default DashBoard