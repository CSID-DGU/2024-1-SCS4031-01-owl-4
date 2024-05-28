import {create} from 'zustand'

const useResponseStore = create(
    set => ({
        responsePortfolio: {},
        responseBackTest: {},
        loading: false,
        submit: false,
        setResponseBackTest: responseBackTest => set({responseBackTest}),
        setResponsePortfolio: responsePortfolio => set({responsePortfolio}),
        setLoading: () => set((state) => ({loading: !state.loading})),
        setSubmiting: () => set((state) => ({submit: !state.submit}))
    })
)

export default useResponseStore
