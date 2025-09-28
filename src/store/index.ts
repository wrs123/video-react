import { create } from "zustand";
import {DownloadTaskType} from "../../types.ts";


export const useCusStore = create((set: any) => ({
    downloadingList: [],
    downloadFinishList: [],
    setDownloadingList: (value: any) => set((state: any) => ({
        downloadingList:  value
    })),
    setDownloadFinishList: (value: any) => set((state: any) => ({
        downloadFinishList:  value
    }))
}))
