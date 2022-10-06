import React, { useState, useEffect } from "react";
import { usePrifina } from "@prifina/hooks-v2";

import {APP_ID} from "./environment";

import "./style.scss"

import TotalDownloads from "./components/TotalDownloads"
import PackagesList from "./components/PackagesList"
import LoadingScreen from "./components/LoadingScreen"
import ChartData from "./components/ChartData"

const App = (props) => {

  const { size, data } = props;
  const { onUpdate } = usePrifina();

  const [packagesData, setPackagesData] = useState([])
  const [weeklyDownloads,setweeklyDownloads] = useState([])
  const [allTimeDownloads, setAllTimeDownloads] = useState([])
  const [packagesCreateData, setPackagesCreateData] = useState([])
  const [chartData, setChartData] = useState()

  const [allTimeTotal, setAllTimeTotal] = useState(0)
  const [weeklyTotal, setWeeklyTotal] = useState(0)

  const [readyData,setReadyData] = useState([])
  const [isReady, setIsReady] = useState(false)
  const [isChartShowen, setIsChartShowen] = useState(false)

  const d = new Date()
  const today = d.setDate(d.getDate()) 
  const todayDate = new Date(today).toISOString().split("T")[0]

  let view = size;
  if (
    typeof data !== "undefined" &&
    data.hasOwnProperty("settings") &&
    typeof data.settings === "object" &&
    data.settings.hasOwnProperty("size") &&
    data.settings.size.length > 0
  ) {
    view = data.settings.size;
  }

  const [displaySize, setDisplaySizeSize] = useState(view)

  const dataUpdate = (data) => {
    console.log("Data Update", data)

    if (
      data.hasOwnProperty("settings") &&
      typeof data.settings === "object" &&
      data.settings.hasOwnProperty("size")
    ) {
      setDisplaySizeSize(data.settings.size);
    }
  }

  //Get all names Startiing at "@dynamic-data"
  useEffect(() => {
    onUpdate(APP_ID, dataUpdate);

    fetch("https://registry.npmjs.com/-/v1/search?text=@dynamic-data&size=1000")
    .then(res => res.json())
    .then(res => setPackagesData(res.objects))
  }, [])

  useEffect(()=>{
    packagesData.forEach(item =>{
      fetch(`https://api.npmjs.org/downloads/point/last-week/${item.package.name}`)
      .then(res => res.json())
      .then(res => setweeklyDownloads(prevData =>[...prevData, res]))
    })

    packagesData.forEach(item =>{
      fetch(`https://registry.npmjs.org/${item.package.name}`)
      .then(res => res.json())
      .then(res => setPackagesCreateData(prevData =>[...prevData, res]))
    })
  },[packagesData])

  //Get weekly Total
  useEffect(()=>{
    if (weeklyDownloads.length ===  packagesData.length){
      weeklyDownloads.forEach(item=>{
        setWeeklyTotal(prevData => prevData + item.downloads)
      })
    }
  },[weeklyDownloads])

  //Calculate All Time Downloads
  useEffect(()=>{
    if (allTimeDownloads.length ===  packagesData.length){
      allTimeDownloads.forEach(item=>{
        setAllTimeTotal(prevData => prevData + item.downloads)
      })
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  },[allTimeDownloads])

  //Get all time downloads
  useEffect(()=>{
    if (packagesCreateData.length === packagesData.length){
      console.log("packagesCreateData", packagesCreateData)

      packagesCreateData.forEach(item=>{

        const createdData = item.time.created
        const cleardData = createdData.split("T")[0]

        fetch(`https://api.npmjs.org/downloads/point/${cleardData}:${todayDate}/${item.name}`)
        .then(res => res.json())
        .then(res => setAllTimeDownloads(prevData =>[...prevData, res]))
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[packagesCreateData])

  //Process Data
  useEffect(()=>{
    if(packagesData.length === weeklyDownloads.length && packagesData.length === allTimeDownloads.length){
      setReadyData([])
      console.log("data", packagesData)
      console.log("weeklyDownloads", weeklyDownloads)
      console.log("allTimeDownloads", allTimeDownloads)

      weeklyDownloads.forEach(item=>{
        let dataHolder = {}

        let allTimeIndex = allTimeDownloads.findIndex((obj => obj.package === item.package));

        dataHolder["packageName"] = item.package 
        dataHolder["weeklyDownloads"] = item.downloads
        dataHolder["allDownloads"] = allTimeDownloads[allTimeIndex].downloads
        dataHolder["allDownloadsStartRange"] = allTimeDownloads[allTimeIndex].start
        dataHolder["allDownloadsEndRange"] = allTimeDownloads[allTimeIndex].end
        dataHolder["allDownloadsRange"] = `${allTimeDownloads[allTimeIndex].start} / ${allTimeDownloads[allTimeIndex].end}`
        console.log()
        setReadyData(prevData => [...prevData, dataHolder])
      })
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  },[weeklyDownloads,allTimeDownloads])

  useEffect(()=>{
    console.log("readyData", readyData)
    if(packagesData.length === readyData.length){
      setIsReady(true)
    }
  },[readyData])

  const handleChart = (processData) => {
    if(processData){
      const packageName = processData.packageName
      const date = processData.allDownloadsStartRange
      console.log(packageName,date)
      const packageCreateData = new Date(date)
      const fullDate = packageCreateData.setDate(packageCreateData.getDate() - (packageCreateData.getDay() + 6) % 7)
      let startDate = new Date(fullDate).toISOString().split("T")[0]
      
      fetch(`https://api.npmjs.org/downloads/range/${startDate}:${todayDate}/${packageName}`)
      .then(res => res.json())
      .then(res => handleChartData(res, processData))
    }else{
      setChartData()
    }
    setIsChartShowen(prevState => !prevState)
  }

  const handleChartData = (downloadsList, processData) => {
    console.log(downloadsList)
    const downloadList = downloadsList.downloads
    let chartDataHolder = []

    for (let i = 0; i < downloadList.length; i += 7) {
      let dataHolder = {}
      const chunk = downloadList.slice(i, i + 7);

      let chartDownloads = 0
      chunk.forEach(item =>{
        chartDownloads = chartDownloads + item.downloads
      })
      dataHolder["totalDownloads"] = chartDownloads
      dataHolder["dateSpan"] = `${chunk[0].day} / ${chunk[chunk.length-1].day}`
      chartDataHolder.push(dataHolder)
    }

    const chartData={
      packageInfo: processData,
      package: downloadsList.package,
      chartData: chartDataHolder
    }

    console.log(chartData)
    setChartData(chartData)
  }

  return (
    <div className="container">
      {
      isReady?
        <div>
          {chartData && <ChartData chartData={chartData} handleChart={handleChart}/>}
          <TotalDownloads allTimeTotal={allTimeTotal} weeklyTotal={weeklyTotal}/>
          <hr/>
          <PackagesList packages={readyData} handleChart={handleChart}/>
        </div>
      :
        <LoadingScreen/>
      }
    </div>
  )
};

App.defaultProps = {
  size: "small",
}

export default App;
