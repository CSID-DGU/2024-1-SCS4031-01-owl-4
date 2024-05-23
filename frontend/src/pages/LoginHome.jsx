import LoginSection from '../layouts/LoginHome/LoginSection';
import useStore from '../utils/store';
import { useEffect } from 'react';
import {useSearchParams} from 'react-router-dom';
import { Navigate } from "react-router-dom";


const LoginHome = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { auth, loginAuth, logoutCheck } = useStore(state => state);

    useEffect(() => {
        const token = searchParams.get("access_token");
        if (token) {
            loginAuth();
        } else {
            logoutCheck();
        }
    }, [searchParams, loginAuth, logoutCheck]);

    console.log(auth);

  return (
        auth ? <Navigate to='/dashboard' /> : <LoginSection />
  )
}

export default LoginHome