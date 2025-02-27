"use client"
import TextField from '@mui/material/TextField';
import { useState } from "react";
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

type RequestProps = {
    date: string;
    meal: string;
    energy: number;
    protein: number;
    fat: number;
    carbs: number;
    cost: number;
}

export default function Meal() {
    const [requestData, setRequestData] = useState<RequestProps>({
        date: "",
        meal: "",
        energy: 0,
        cost: 0,
        fat: 0,
        carbs: 0,
        protein: 0
    })

    // POST method
    const handleSubmit = () => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    }

    return (
        <div className="m-5">
            <form className="grid grid-cols-3 gap-3">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={dayjs(requestData.date)}
                        onChange={(date: Dayjs | null) => {
                            if(date) {
                                setRequestData(prev => ({...prev, date: date.format("YYYY-MM-DD")}))
                            }
                        }}
                    />
                </LocalizationProvider>
                <TextField
                    required
                    id="outlined-required"
                    label="Meal"
                    onChange={(event) => setRequestData(prev => ({...prev, meal: event.target.value}))}
                />
                <div className="flex flex-row items-center gap-2">
                    <TextField
                        id="outlined-required"
                        label="Energy"
                        type='number'
                        value={requestData.energy}
                        onChange={(event) => setRequestData(prev => ({...prev, energy: parseFloat(event.target.value)}))}
                    />
                    <p>kcal</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <TextField
                        id="outlined-required"
                        label="Protein"
                        type='number'
                        value={requestData.protein}
                        onChange={(event) => setRequestData(prev => ({...prev, protein: parseFloat(event.target.value)}))}
                    />
                    <p>g</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <TextField
                        id="outlined-required"
                        label="Fat"
                        type='number'
                        value={requestData.fat}
                        onChange={(event) => setRequestData(prev => ({...prev, fat: parseFloat(event.target.value)}))}
                    />
                    <p>g</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <TextField
                        id="outlined-required"
                        label="Carbs"
                        type='number'
                        value={requestData.carbs}
                        onChange={(event) => setRequestData(prev => ({...prev, carbs: parseFloat(event.target.value)}))}
                    />
                    <p>g</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <TextField
                        id="outlined-required"
                        label="Cost"
                        type='number'
                        value={requestData.cost}
                        onChange={(event) => setRequestData(prev => ({...prev, cost: parseFloat(event.target.value)}))}
                    />
                    <p>€</p>
                </div>
                <Button onClick={handleSubmit} variant="contained">Submit</Button>
            </form>
        </div>
    );
}