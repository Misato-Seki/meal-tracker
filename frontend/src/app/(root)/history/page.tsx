"use client";
import { useEffect, useState } from "react";

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableFooter } from "@mui/material";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

import { useRouter } from "next/navigation";

type ResponseProps = {
  cost: number;
  date: string;
  meal: string
  energy: number;
  protein: number;
  id: number;
  fat: number;
  carbs: number;
}
export default function Page() {
  const router = useRouter();
  const [mealData, setMealData] = useState<ResponseProps[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  )
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        setMealData(data)
        setIsLoading(false)
      })
      .catch((err) => {
        setError("Failed to fetch data.")
        console.log(err)
        setIsLoading(false)
      });
  }, [selectedDate]);


  return (
    <div className="flex flex-col items-center justify-center gap-5 my-5">
      <p className="text-xl font-mono font-bold text-gray-500">History</p>
      {/* Filter */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
              value={dayjs(selectedDate)}
              onChange={(date: Dayjs | null) => {
                  if(date) {
                      setSelectedDate(date.format("YYYY-MM-DD"))
                  }
              }}
          />
      </LocalizationProvider>
      {isLoading && !error && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {mealData && mealData.length > 0 ? (
        <TableContainer className="flex justify-center items-center">
          <Table sx={{ minWidth: 375, maxWidth: 600 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Meal</TableCell>
                <TableCell align="right">kcal</TableCell>
                <TableCell align="right">€</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mealData.map((item) => (
                <TableRow key={item.id} onClick={() => router.push(`/record/${item.id}`)} className="hover:bg-gray-100 cursor-pointer">
                  <TableCell component="th" scope="row">
                    {item.date}
                  </TableCell>
                  <TableCell>{item.meal}</TableCell>
                  <TableCell align="right">{item.energy}</TableCell>
                  <TableCell align="right">{item.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} align="right">Total</TableCell>
                <TableCell align="right">
                  {mealData.reduce((sum, item) => sum + item.energy, 0)}
                </TableCell>
                <TableCell align="right">
                  {mealData.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      ) : (
        <div>No data.</div>
      )}
    </div>
  );
}