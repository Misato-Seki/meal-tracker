"use client";
import { useEffect, useState } from "react";

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
export default function Home() {
  const [mealData, setMealData] = useState<ResponseProps[]>();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals`)
      .then((res) => res.json())
      .then((data) => setMealData(data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="flex flex-col items-center justify-center">
      {mealData && mealData?.length > 0 ? (mealData.map((item) => (
        <div key={item.id}>
          <p>Date: {item.date}</p>
          <p>Meal: {item.meal}</p>
          <p>Energy: {item.energy}</p>
          <p>Protein: {item.protein}</p>
          <p>Fat: {item.fat}</p>
          <p>Carbs: {item.carbs}</p>
          <p>Cost: {item.cost}</p>
        </div>
      ))): (
        <div>
          No data.
        </div>
      )}
    </div>
  );
}