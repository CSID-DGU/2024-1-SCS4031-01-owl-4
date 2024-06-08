import {create} from 'zustand'
import { persist } from 'zustand/middleware'

const useKeyStore = create(
    persist(
        set => ({
            has_key: false,
            setKey: has_key => set({has_key})
        }),
        {
            name: 'key'
        }
    )
    
)

export default useKeyStore