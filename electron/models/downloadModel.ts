import {BaseResult} from "../../types.ts";
import {ResultStatus} from "../../enums.ts";
import { dialog } from 'electron'
import {PathAnalysis} from "../libs/pathAnalysis.ts";

export const getVideoUrl = async () => {

}

export const createTask = async (param: any) => {

    const filePath =  await PathAnalysis(param.urls)
    console.log(filePath)
    return 'ok'
}
