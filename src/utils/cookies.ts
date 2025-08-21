'use server';

import { cookies } from "next/headers";
import { typeSameSite } from "@/types/auth";
import { parseCookieString } from "./helpers";

// set from cookie string
export async function setCookieString(cookieString: string) {
  const cookieObj = await cookies();
  const parsed = parseCookieString(cookieString);

  cookieObj.set({
    name: parsed.name,
    value: parsed.value,
    httpOnly: parsed.httpOnly ?? false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: parsed.sameSite as typeSameSite,
    path: parsed.path ?? '/',
    expires: parsed.expires ? new Date(parsed.expires) : undefined,
  });
}

// set from many array of strings
export async function setCookies(cookieStrings: string[]) {
  for (const cookieString of cookieStrings) {
    await setCookieString(cookieString);
  }
}

// name and value, default
export async function setCookie(name: string, value: string) {

  const cookieObj = await cookies()

  cookieObj.set({
    name: name,
    value: value,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const, // prevent csrf
    maxAge: 60 * 60, // 
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
}

export async function deleteCookies() {
  const cookieObj = await cookies();

  const all = cookieObj.getAll();

  all.forEach(cookie => cookieObj.delete(cookie.name))
}