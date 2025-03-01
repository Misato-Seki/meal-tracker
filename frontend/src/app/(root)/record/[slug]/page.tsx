"use client"
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { useParams } from 'next/navigation';

type RequestProps = {
    date: string;
    meal: string;
    energy: number;
    protein: number;
    fat: number;
    carbs: number;
    cost: number;
}

export default function Page() {
    const { slug } = useParams()

    const [requestData, setRequestData] = useState<RequestProps>({
        date: "",
        meal: "",
        energy: 0,
        cost: 0,
        fat: 0,
        carbs: 0,
        protein: 0
    })
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    //GET method
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals/${slug}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            setRequestData(prev => ({
                date: data.date || prev.date,  // Prevent undefined values
                meal: data.meal || prev.meal,
                energy: data.energy ?? prev.energy,
                cost: data.cost ?? prev.cost,
                fat: data.fat ?? prev.fat,
                carbs: data.carbs ?? prev.carbs,
                protein: data.protein ?? prev.protein
            }));
        })
        .then((data) => console.log(data))
        .catch((err) => {
            console.log(err)
        })
    },[slug])


    // PUT method
    const handleUpdate = () => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals/${slug}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        })
        .then((res) => {
            if(res.ok){
                setStatus("success")
            } else {
                setStatus("error")
            }
            return res.json()
        })
        .then((data) => console.log(data))
        .catch((err) => {
            setStatus("error")
            console.log(err)
        })
        .finally(() => {
            handleClick();
            setRequestData({
                date: "",
                meal: "",
                energy: 0,
                cost: 0,
                fat: 0,
                carbs: 0,
                protein: 0
            })
        })
    }

    // Delete Method
    const handleDelete = () => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals/${slug}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => {
            if(res.ok){
                setStatus("success")
            } else {
                setStatus("error")
            }
            return res.json()
        })
        .then((data) => console.log(data))
        .catch((err) => {
            setStatus("error")
            console.log(err)
        })
        .finally(() => {
            handleClick();
            setRequestData({
                date: "",
                meal: "",
                energy: 0,
                cost: 0,
                fat: 0,
                carbs: 0,
                protein: 0
            })
        })
    }

    // Handle Snackbar
    const handleClick = () => {
        setOpen(true);
      };
    
      const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
      ) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    return (
        <div className="flex flex-col items-center justify-center gap-5 m-5">
            <p className="text-xl font-mono font-bold text-gray-500">Record</p>
            <p>Slug: {slug}</p>
            <form className="flex flex-col gap-3 justify-center items-center mx-auto">
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
                    value={requestData.meal}
                />
                {/* <div className="flex flex-row items-center gap-2"> */}
                    <TextField
                        id="outlined-required"
                        label="Energy(kcal)"
                        type='number'
                        value={requestData.energy}
                        onChange={(event) => setRequestData(prev => ({...prev, energy: parseFloat(event.target.value)}))}
                    />
                {/* </div> */}
                {/* <div className="flex flex-row items-center gap-2">
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
                </div> */}
                {/* <div className="flex flex-row items-center gap-2"> */}
                    <TextField
                        id="outlined-required"
                        label="Cost(€)"
                        type='number'
                        value={requestData.cost}
                        onChange={(event) => setRequestData(prev => ({...prev, cost: parseFloat(event.target.value)}))}
                    />
                {/* </div> */}
               <div className='flex flex-row gap-5'>
                <Button onClick={handleUpdate} variant="contained">Save</Button>
                <Button onClick={handleDelete} variant="contained" color='error'>Delete</Button>
               </div>
                <Snackbar
                    open={open}
                    autoHideDuration={5000}
                    onClose={handleClose}
                    message={status === "success" ? "Success to Record" : "Something went wrong"}
                />
            </form>
        </div>
    );
}