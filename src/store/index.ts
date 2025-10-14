import { create } from "zustand";
import {DownloadTaskType} from "../../types.ts";


export const useCusStore = create((set: any) => ({
    downloadingList: [],
    downloadFinishList: [],
    setDownloadingList: (value: any) => set((state: any) => ({
        downloadingList:  value
    })),
    delDownloadingList: (value: any) => set((state: any) => ({
        downloadingList:  state.downloadingList.filter( preItem => preItem.id !== value )
    })),
    updateDownloadingList: (value: any) => set((state: any) => ({
        downloadingList:  state.downloadingList.map(preItem =>
            value.id == preItem.id ? {...preItem, ...value} : preItem
        )
    })),
    pushDownloadingList: (value: any) => set((state: any) => ({
        downloadingList:  state.downloadingList.push(value)
    })),
    setDownloadFinishList: (value: any) => set((state: any) => ({
        downloadFinishList:  value
    })),
    updateDownloadFinishList: (value: any) => set((state: any) => ({
        downloadFinishList:  state.downloadFinishList.map(preItem =>
            value.id == preItem.id ? {...preItem, ...value} : preItem
        )
    })),
    pushDownloadFinishList: (value: any) => set((state: any) => ({
        downloadFinishList:  state.downloadFinishList.push(value)
    })),
    delDownloadFinishList: (value: any) => set((state: any) => ({
        downloadFinishList:  state.downloadFinishList.filter( preItem => preItem.id !== value )
    })),
}))
