import LoginSection from '../layouts/LoginHome/LoginSection';
import useStore from '../utils/store';
import useTokenStore from '../utils/token';
import { useEffect, useState } from 'react';
import {useSearchParams} from 'react-router-dom';
import { Navigate } from "react-router-dom";
import useKeyStore from '../utils/useKeyStore';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const LoginHome = () => {
    const [searchParams] = useSearchParams();
    const { auth, loginAuth, logoutCheck } = useStore(state => state);
    const { setToken } = useTokenStore();
    const { setKey } = useKeyStore();
    const [agree, setAgree] = useState(false);

    useEffect(() => {
        const token = searchParams.get("access_token");
        const key = searchParams.get("has_key");
        setToken(token);
        setKey(key);
        if (token) {
            loginAuth();
        } else {
            logoutCheck();
        }
    }, [searchParams, loginAuth, logoutCheck, setToken, setKey]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['agrees'],
        queryFn: async () => {
            const token = searchParams.get("access_token");
            if (!token) {
                throw new Error('No token found');
            }
            const response = await axios.get("http://localhost:8081/api/v1/users/agreement", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setAgree(response.data.payload.is_agree);
            return response.data.payload.is_agree;
        },
        enabled: !!searchParams.get("access_token") // Only run the query if the token exists
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading data</div>;
    }

    if (auth) {
        if (agree) {
            return <Navigate to='/dashboard' />;
        } else {
            return <Navigate to='/account' />;
        }
    }

    return <LoginSection />;
};

export default LoginHome;