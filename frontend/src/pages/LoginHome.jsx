import png from '/src/assets/logo.svg';
import google from '../assets/images/google_logo.png'
import kakao from '../assets/images/kakao_logo.png'
import naver from '../assets/images/naver_logo.png'

import {Link, useSearchParams, Navigate } from 'react-router-dom';


const LoginHome = () => {
    const [searchParams, setSearchparams] = useSearchParams()

    const username = searchParams.get("name")
    const token = searchParams.get("access_token")
    
    if(token){
        return(
            <Navigate replace to='/dashboard'/>
        )
    }

  return (
        <div className="flex h-screen justify-center items-center bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-400">
            <main className='relative w-2/5 m-auto px-6 text-gray-500 bg-white rounded-xl shadow-xl'>
                <div className="p-6 mt-10">
                    <div className="space-y-4">
                        <a href="/" className='flex gap-3 text-3xl text-cyan-900 font-bold items-center mb-10'>
                            <img src={png} alt="logo" loading='lazy' className='w-10' />
                            BamOwl
                        </a>
                        <h2 className='mb-8 text-2xl text-cyan-900 font-bold'>Sign in to unlock the <br/> best of BamOwl.</h2>
                    </div>
                    <div className='mt-16 grid space-y-4 gap-2'>
                        <Link to='./oauth2/code/google' className='group flex justify-center h-14 px-3 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100'>
                            <div className='relative w-full flex items-center space-x-4 justify-center'>
                                <img src={google} alt="google logo" className=' absolute left-0 size-10' />
                                <span className='block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600'>Continue with Google</span>
                            </div>
                        </Link>
                        <Link to='./oauth2/code/kakao' className='group flex justify-center h-14 px-3 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100'>
                            <div className='relative w-full flex items-center space-x-4 justify-center'>
                                <img src={kakao} alt="google logo" className=' absolute left-0 size-10' />
                                <span className='block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600'>Continue with Google</span>
                            </div>
                        </Link>
                        <Link to='./oauth2/code/naver' className='group flex justify-center h-14 px-3 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100'>
                            <div className='relative w-full flex items-center space-x-4 justify-center'>
                                <img src={naver} alt="google logo" className=' absolute left-0 size-10' />
                                <span className='block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600'>Continue with Google</span>
                            </div>
                        </Link>
                    </div>
                    <div className="mt-32 space-y-4 text-gray-600 text-center">
                         <p className="text-xs">By proceeding, you agree to our <a href="#" className="underline">Terms of Use</a> and confirm you have read our <a href="#" className="underline">Privacy and Cookie Statement</a>.</p>
                         <p className="text-xs">This site is protected by reCAPTCHA and the <a href="#" className="underline">Google Privacy Policy</a> and <a href="#" className="underline">Terms of Service</a> apply.</p>
                    </div>
                </div>
            </main>    
        </div>
  )
}

export default LoginHome