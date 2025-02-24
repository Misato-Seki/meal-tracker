"use client";
import { useEffect, useState } from "react";
export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/food`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <h1>Home</h1>
      <h2>{message}</h2>
      <p>Added Text.</p>
    </div>
  );
}