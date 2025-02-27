"use client";
import Link from "next/link";


export default function Home() {
  
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Meal Tracker</h1>
      <Link href="/log">Log</Link>
      <Link href="/meal">Meal</Link>
    </div>
  );
}