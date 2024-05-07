import {Route, createBrowserRouter,createRoutesFromElements} from 'react-router-dom'
import MainHome from "./MainHome";
import LoginHome from "./LoginHome";
import NotFound from './NotFound';
// import Error from '../components/Error';
import DashBoard from './DashBoard';
import {Portfolio, Chart, Table, Run, Strategy} from './Side/index'

export const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path='/' element={<MainHome/>} />
    <Route path='login' element={<LoginHome/>}>
      <Route path='oauth2/code/google'/>
      <Route path='oauth2/code/kakao'/>
      <Route path='oauth2/code/naver'/>
    </Route>
    <Route path='dashboard' element={<DashBoard/>} >
      <Route path='chart' element={<Chart/>} />
      <Route path='table' element={<Table/>} />
      <Route path='strategy' element={<Strategy/>} />
      <Route path='run' element={<Run/>} />
      <Route path='portfolio' element={<Portfolio/>} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </>
    
))