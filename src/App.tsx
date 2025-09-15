import './App.css'
import Index from './view/Index/Index';
import { useEffect, useState } from 'react'
import API from "./request/api.ts";
import {ResultStatus} from "../enums.ts";
import { ThemeProvider, useTheme } from "./components/ThemeProvider.tsx";



function InitBox() {

  const [isInitialized, setIsInitialized] = useState(false);
  const { toggleTheme } = useTheme();

  async function initConfig(){

    const res = await API.getSysConfig()
    console.warn(res)
    if(res.status === ResultStatus.OK){
      window["sysConfig"] = res.data
      toggleTheme(window["sysConfig"].themeMode)
      setIsInitialized(true)
    }

  }

  useEffect(() => {
    initConfig()
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
      <Index />
  )
}

export default function App() {
  return (
      <ThemeProvider>
        <InitBox />
      </ThemeProvider>
  );
}
