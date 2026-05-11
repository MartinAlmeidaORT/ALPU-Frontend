interface GooglePrefill {
  subject: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export function setGooglePrefill(data: GooglePrefill) {
  sessionStorage.setItem('googlePrefill', JSON.stringify(data));
}

export function getGooglePrefill(): GooglePrefill | null {
  const data = sessionStorage.getItem('googlePrefill');
  return data ? JSON.parse(data) : null;
}

export function clearGooglePrefill() {
  sessionStorage.removeItem('googlePrefill');
}
