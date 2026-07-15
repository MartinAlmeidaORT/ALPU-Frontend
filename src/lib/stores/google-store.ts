interface GooglePrefill {
  subject: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export function setGooglePrefill(data: GooglePrefill): void {
  sessionStorage.setItem('googlePrefill', JSON.stringify(data));
}

export function getGooglePrefill(): GooglePrefill | null {
  const data = sessionStorage.getItem('googlePrefill');
  return data ? JSON.parse(data) : null;
}

export function clearGooglePrefill(): void {
  sessionStorage.removeItem('googlePrefill');
}
