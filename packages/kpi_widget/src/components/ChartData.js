import React, { useRef, useEffect, useState } from "react";
import { LineChart, Line, XAxis, Brush, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ChartData({chartData, handleChart}) {

    const [showenChart,setShowenChart] = useState("weekly")

    const [customStartData,setCustomStartData] = useState()
    const [customEndData,setCustomEndData] = useState()
    const [customDownloads, setCustomDownloads] = useState()

    //Set custom Data range
    useEffect(()=>{
        if(Date.parse(customStartData) < Date.parse(customEndData)){
            setCustomDownloads()

            fetch(`https://api.npmjs.org/downloads/range/${customStartData}:${customEndData}/${chartData.packageInfo.packageName}`)
            .then(res => res.json())
            .then(res => setCustomDownloads(res))
            
        }else{
            setCustomDownloads()
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    },[customStartData,customEndData])

    useEffect(()=>{
        console.log(customDownloads)
    },[customDownloads])
  

    const CustomizedTooltipWeekly = ({ active, payload, label }) => {
        if (active) {
        return (
            <div className="chart-tooltip">
            <div className="chart_custom_tooltip">
                <span>Day: {payload[0].day}</span>
                <span>Downloads: {payload[0].downloads}</span>
            </div>
            </div>
        );
        }
    
        return null;
    };

    const CustomizedTooltipCustom = ({ active, payload, label }) => {
        if (active) {
        return (
            <div className="chart-tooltip">
                <div className="chart_custom_tooltip">
                    <span>Day: {payload[0].payload.day}</span>
                    <span>Downloads: {payload[0].payload.downloads}</span>
                </div>
            </div>
        );
        }
    
        return null;
    };
    
    const options = [
        { value: "weekly", label: "Weekly Downloads" },
        { value: "custom", label: "Custom Downloads"}
    ]

    const handleChange = (e) =>{
        setShowenChart(e.target.value)
    }

  return (
    <div className="chart">
        <div 
            className="arrow_border" 
            onClick={() => handleChart()}
        >
            <i className="arrow left"/>
        </div>

        <select 
            className="select"
            onChange={e => handleChange(e)}
        >
            {options.map((option) => (
              <option value={option.value} key={option.label}>{option.label}</option>
            ))}
        </select>

        {showenChart === "weekly" ?
        <>
            <div className="downloadsTitle">
                <h1>Package: {chartData.packageInfo.packageName.slice(13)}</h1>
                <p>Time Z Downloads: {chartData.packageInfo.allDownloads}</p>
                <p>This week Downloads: {chartData.packageInfo.weeklyDownloads}</p>
            </div>

            <div className="chart_viev">
                <ResponsiveContainer width="100%" height="85%">
                    <LineChart
                        width={250}
                        height={200}
                        data={chartData.chartData}
                        margin={{
                            top: 5,
                            right: 40,
                            left: -10,
                            bottom: 10,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <YAxis />
                        <XAxis />
                        <Tooltip content={<CustomizedTooltipWeekly />} />
                        <Brush dataKey="totalDownloads" height={20} stroke="#8884d8" />
                        <Line dataKey="totalDownloads" stroke="#8884d8" name="dateSpan" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
        :
        <>
            <div className="downloadsTitle">
                <h1>Package: {chartData.packageInfo.packageName.slice(13)}</h1>
                <p>From: 
                    <input 
                        type="date"
                        onChange={
                            (event) => setCustomStartData(event.target.value)
                        }
                /></p>

                <p>To:                      
                    <input 
                        type="date"
                        onChange={
                            (event) => setCustomEndData(event.target.value)
                        }
                /></p>
            </div>

            <div className="chart_viev">
                {
                    customDownloads ?
                    <ResponsiveContainer width="100%" height="85%">
                        <LineChart
                            width={250}
                            height={200}
                            data={customDownloads.downloads}
                            margin={{
                                top: 5,
                                right: 40,
                                left: -10,
                                bottom: 10,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <YAxis />
                            <XAxis />
                            <Tooltip content={<CustomizedTooltipCustom />} />
                            <Brush dataKey="downloads" height={20} stroke="#8884d8" />
                            <Line dataKey="downloads" stroke="#8884d8" name="dateSpan" />
                        </LineChart>
                    </ResponsiveContainer>
                    :
                    <>
                        <div className="notification">
                            <p>Specify Data Range !</p>
                        </div>
                    </>
                }
            </div>
        </>
        }

    </div>
  );
};

export default ChartData;

