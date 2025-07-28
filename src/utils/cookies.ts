'use server';

import { cookies } from "next/headers";

// cookies are only accessible in server-side
// when sending request to the backend, these methods are goina be useful

export async function setCookie(name: string, value: string) {

  const cookieObj = await cookies()

  cookieObj.set({
    name: name,
    value: value,
    httpOnly: true, // server-side access only 
    secure: process.env.NODE_ENV === 'production', // secure in prod
    sameSite: 'strict' as const, // prevent csrf
    maxAge: 60 * 60 * 24, // a day in seconds
    path: '/', // available site-wide
  });
}

export async function getCookie(name: string) {
  const cookieObj = await cookies();
  // remove .value to have all the options of the cookie
  return cookieObj.get(name)?.value || null;
}

export async function deleteCookie(name: string) {

  const cookieObj = await cookies();

  cookieObj.delete(name);

  // cookieObj.set({
  //   name,
  //   value: '',
  //   maxAge: 0,
  //   path: '/'
  // })
}