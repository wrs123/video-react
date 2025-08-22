import './App.css'
import Index from './view/Index/Index';
import { useEffect, useState } from 'react'
import API from "./request/api.ts";

function App() {

  const [isInitialized, setIsInitialized] = useState(false);

  async function initConfig(){

    const res = await API.getSysConfig()
    window["sysConfig"] = res.data
    setIsInitialized(true)
  }

  useEffect(() => {
    initConfig()
  })

  if(!isInitialized){
    return (
        <div>loading....</div>
    )
  }

  return (
        <Index />
  )
}

export default App
