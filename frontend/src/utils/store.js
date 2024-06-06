import {create} from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
    persist(
        (set) => ({
            auth: false,
            loginAuth: () => set({auth: true}),
            logoutCheck: () => set({auth: false})
        }),
        {
            name: 'auth'
        }
    ),
)

export default useStore