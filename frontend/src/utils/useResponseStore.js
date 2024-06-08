import {create} from 'zustand'

const useResponseStore = create(
    set => ({
        responsePortfolio: {},
        responseBackTest: {},
        loading: false,
        prevPortfolioId: '',
        description: '',
        title: '',
        fund: 1000000,
        candle: 'days',
        m_date: '60',
        n_date: '20',
        buyingCondition: 5,
        sellingCondition: 3,
        buyingSplit: 20,
        stopLossPoint: 10,
        isChecked: false,
        access_key: '',
        secret_key: '',
        comment: '',
        isppc: false,
        issc: false,
        ispic: false,
        setResponseBackTest: responseBackTest => set({responseBackTest}),
        setResponsePortfolio: responsePortfolio => set({responsePortfolio}),
        setLoading: () => set((state) => ({loading: !state.loading})),
        setPrevPortfolioId: prevPortfolioId => set({prevPortfolioId}),
        setDescription: description => set({description}),
        setTitle: title => set({title}),
        setFund: fund => set({fund}),
        setCandle: candle => set({candle}),
        setMdate: m_date => set({m_date}),
        setNdate: n_date => set({n_date}),
        setBuyingCondition: buyingCondition => set({buyingCondition}),
        setSellingCondition: sellingCondition => set({sellingCondition}),
        setBuyingSplit: buyingSplit => set({buyingSplit}),
        setStopLossPoint: stopLossPoint => set({stopLossPoint}),
        setIsChecked: isChecked => set({isChecked}),
        setAccessKey: access_key => set({access_key}),
        setSecretKey: secret_key => set({secret_key}),
        setComment: comment => set({comment}),
        setIsPPC: isppc => set({isppc}),
        setIsSC: issc => set({issc}),
        setIsPIC: ispic => set({ispic})
    })
)

export default useResponseStore

