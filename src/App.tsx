import './App.css'
import { useEffect, useState } from 'react'
import API from "./request/api.ts";
import {ResultStatus} from "./shared/enums.ts";
import { ThemeProvider, useTheme } from "./components/ThemeProvider.tsx";
import router from './router/index'
import { RouterProvider, createHashRouter } from "react-router-dom";
import {useCusStore} from "./store";



function InitBox() {

  const [isInitialized, setIsInitialized] = useState(false);
  const setDownloadList = useCusStore(state => state.setDownloadingList);
  const setDownloadFinishList = useCusStore(state => state.setDownloadFinishList);
  const { toggleTheme } = useTheme();

  async function init() {
    await initConfig()
    await getTaskList(0)
    await getTaskList(1)
  }

  async function initConfig(){

    const res = await API.getSysConfig()
    console.warn(res)
    if(res.status === ResultStatus.OK){
      window["sysConfig"] = res.data
      toggleTheme(window["sysConfig"].themeMode)
      setIsInitialized(true)
    }

  }


  const getTaskList = async (status: number) => {
    const res = await API.getTaskList({ status })
    const _list = res.data.list || []

    if(status === 1){
      setDownloadFinishList(_list)
    }else{
      setDownloadList(_list)
    }
  }


  useEffect(() => {
    init()
  }, [])

  if(!isInitialized){
    return (
        <div>
          {/*<div className="loader">*/}

          {/*</div>*/}
          {/*初始化中*/}
        </div>
    )
  }

  return (
      <RouterProvider router={createHashRouter(router)}></RouterProvider>
  )
}

export default function App() {
  return (
      <ThemeProvider>
        <InitBox />
      </ThemeProvider>
  );
}
