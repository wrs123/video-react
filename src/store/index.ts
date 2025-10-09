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
    setDownloadFinishList: (value: any) => set((state: any) => ({
        downloadFinishList:  value
    })),
    delDownloadFinishList: (value: any) => set((state: any) => ({
        downloadFinishList:  state.downloadFinishList.filter( preItem => preItem.id !== value )
    })),
}))
