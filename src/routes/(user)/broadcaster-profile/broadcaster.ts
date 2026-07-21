export interface Broadcaster {
  firstName: string;
  lastName: string;
  email: string;
  address: {
    countryCode: string | undefined;
    departmentId: number | undefined;
    city: string;
    street: string;
  };
    phoneNumber: string;
    website: string;
    description: string;
}