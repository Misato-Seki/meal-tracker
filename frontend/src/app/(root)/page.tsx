"use client";
import { useEffect, useState } from "react";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';


type ResponseProps = {
  date: string;
  total_energy: number;
  total_cost: number;
}

export default function Home() {
  const [ summaryData, setSummaryData ] = useState<ResponseProps>();

  useEffect(()=>{
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/summary`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((data: ResponseProps) => setSummaryData(data))
    .catch((error) => console.log(error))
  }, [])
  
  return (
    <div className="flex flex-col items-center justify-center gap-5 m-5">
      <p className="text-xl font-mono font-bold text-gray-500">Today&apos;s Summary</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="text-white content-between border bg-orange-400 p-10 rounded-lg">
          <p className="text-start text-4xl">Energy</p>
          <p className="text-center text-6xl">{summaryData?.total_energy}</p>
          <p className="text-end text-4xl">kcal</p>
        </div>
        <div className="text-white content-between border bg-orange-400 p-10 rounded-lg">
          <p className="text-start text-4xl">Cost</p>
          <p className="text-center text-6xl">{summaryData?.total_cost}</p>
          <p className="text-end text-4xl">€</p>
        </div>
      </div>
      <Tooltip title="Add Record">
        <Fab color="inherit" aria-label="add" component="a" href="/record">
          <AddIcon />
        </Fab>
      </Tooltip>
    </div>
  );
}