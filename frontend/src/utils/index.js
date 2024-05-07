import { redirect } from "react-router-dom";

export async function requireAuth(requset){
    const pathname = new URL(requset.url).pathname;
    const isLoggedIn = localStorage.getItem("token")

    if(!isLoggedIn){
        throw redirect(
            `/login?message=You must log in first.&redirectTo=${pathname}`
        )
    }
}