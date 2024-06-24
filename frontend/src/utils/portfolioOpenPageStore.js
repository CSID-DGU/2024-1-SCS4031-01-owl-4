import {create} from 'zustand'

const usePortfolioOpenPageStore = create(
    set => ({
        isCurrentPage: '',
        setIsCurrentPage: isCurrentPage => set({isCurrentPage})
    })
)

export default usePortfolioOpenPageStore