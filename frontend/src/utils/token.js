import {create} from 'zustand'
import { persist } from 'zustand/middleware'

const useTokenStore = create(
    persist(
        set => ({
            token: '',
            setToken: token => set({token})
        }),
        {
            name: 'token'
        }
    )
    
)

export default useTokenStore