import {create} from 'zustand'

const useResponseStore = create(
    set => ({
        responseBackTest: {},
        setResponseBackTest: responseBackTest => set({responseBackTest})
    })
)

export default useResponseStore