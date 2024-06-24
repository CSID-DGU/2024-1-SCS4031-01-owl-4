import { Outlet, Navigate } from "react-router-dom";
import useStore from '../utils/store';

const PrivateRoutes = () => {
    const auth = useStore(s => s.auth);
    return(
        auth ? <Outlet />: <Navigate to='/login' />
    )

}

export default PrivateRoutes