import { typeParsedCookie } from "@/types/auth";

export function parseCookieString(cookieString: string): typeParsedCookie {
  const parts = cookieString.split('; ').map(part => part.trim());
  const [nameValue, ...attributes] = parts;
  const [name, value] = nameValue.split('=');

  const cookieAttributes: typeParsedCookie = {
    name,
    value,
  };

  for (const attr of attributes) {
    const [key, val] = attr.includes('=') ? attr.split('=') : [attr, true];
    const lowerKey = key.toLowerCase();

    if (lowerKey === 'path' && typeof val === 'string') {
      cookieAttributes.path = val;
    }
    if (lowerKey === 'samesite' && typeof val === 'string') {
      // Convert to lowercase and validate allowed values
      const sameSiteValue = val.toLowerCase() as 'lax' | 'strict' | 'none';
      if (['lax', 'strict', 'none', 'undefined'].includes(sameSiteValue)) {
        cookieAttributes.sameSite = sameSiteValue;
      } else {
        cookieAttributes.sameSite = 'lax';
      }
    }
    if (lowerKey === 'httponly') {
      cookieAttributes.httpOnly = true;
    }
    if (lowerKey === 'secure') {
      cookieAttributes.secure = true;
    }
    if (lowerKey === 'expires' && typeof val === 'string') {
      cookieAttributes.expires = val;
    }
  }

  return cookieAttributes;
}