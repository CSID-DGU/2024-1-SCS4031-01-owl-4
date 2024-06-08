import {Route, createBrowserRouter,createRoutesFromElements} from 'react-router-dom'
import MainHome from "./MainHome";
import LoginHome from "./LoginHome";
import NotFound from './NotFound';
// import Error from '../components/Error';
import DashBoard from './DashBoard';
import {Home, Portfolio, Chart, Table, Run, Strategy} from './Side/index.js'
import PrivateRoutes from '../utils/PrivateRoutes';
import Account from './Account.jsx';

export const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path='/' element={<MainHome/>} />
    <Route path='login' element={<LoginHome/>}>
      <Route path='oauth2/authorization/google'/>
      <Route path='oauth2/authorization/kakao'/>
      <Route path='oauth2/authorization/naver'/>
    </Route>
    
    <Route element={<PrivateRoutes />}>
      <Route path='account' element={<Account />}>
      </Route>
    </Route>
    
    <Route element={<PrivateRoutes />}>
      <Route path='dashboard' element={<DashBoard/>} >
          <Route index element={<Home/>} />
          <Route path='chart' element={<Chart/>} />
          <Route path='table' element={<Table/>} />
          <Route path='strategy' element={<Strategy/>} />
          <Route path='run' element={<Run/>} />
          <Route path='portfolio' element={<Portfolio/>} />
      </Route>
    </Route>
    
    <Route path="*" element={<NotFound />} />
  </>
    
))