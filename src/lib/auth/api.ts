
'use server';

import { TypeLoginForm } from "@/types/auth";


// login
export async function apiLogin(data: TypeLoginForm) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "email": data.email,
      "password": data.password
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const res = await fetch("http://localhost:7089/api/auth/login", requestOptions);

    if (!res.ok) {
      throw new Error("Error login user");
    }

    const results = await res.json();

    return results;

  } catch (error: unknown) { // poor coding styles
    console.log(error);
    return null;
  }
}