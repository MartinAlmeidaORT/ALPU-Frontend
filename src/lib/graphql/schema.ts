export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: unknown; output: unknown; }
  Decimal: { input: unknown; output: unknown; }
  LocalDate: { input: unknown; output: unknown; }
};

export type Address = {
  __typename?: 'Address';
  addressId: Scalars['Int']['output'];
  city: Scalars['String']['output'];
  country: Country;
  countryCode: Scalars['String']['output'];
  state: Scalars['String']['output'];
  street?: Maybe<Scalars['String']['output']>;
  validateAddress: ResultOfAppError;
  validateCity: ResultOfAppError;
  validateState: ResultOfAppError;
  validateStreet: ResultOfAppError;
};

export type Agency = {
  __typename?: 'Agency';
  agencyId: Scalars['Int']['output'];
  clients: Array<Client>;
  name: Scalars['String']['output'];
};

export type AppError = {
  __typename?: 'AppError';
  kind: ErrorKind;
  message: Scalars['String']['output'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user?: Maybe<User>;
};

export type Bill = {
  __typename?: 'Bill';
  amount: Scalars['Decimal']['output'];
  billId: Scalars['Int']['output'];
  contract?: Maybe<Contract>;
  contractId?: Maybe<Scalars['Int']['output']>;
  date: Scalars['LocalDate']['output'];
  description: Scalars['String']['output'];
  proofFile: Scalars['String']['output'];
  state: BillType;
  title: Scalars['String']['output'];
};

export enum BillType {
  Expense = 'EXPENSE',
  Income = 'INCOME'
}

export type Broadcaster = User & {
  __typename?: 'Broadcaster';
  address: Address;
  addressId: Scalars['Int']['output'];
  category: BroadcasterCategory;
  categoryId: Scalars['Int']['output'];
  contracts: Array<Contract>;
  demos: Array<Demo>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  memberships: Array<Membership>;
  notifications: Array<Notification>;
  rut: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
  userState: UserState;
  validateEmail: ResultOfAppError;
  validateFirstName: ResultOfAppError;
  validateGoogleSignUp: ResultOfAppError;
  validateLastName: ResultOfAppError;
  validatePassword: ResultOfAppError;
  validateRUT: ResultOfAppError;
  validateSignUp: ResultOfAppError;
};

export type BroadcasterCategory = {
  __typename?: 'BroadcasterCategory';
  broadcasterCategoryId: Scalars['Int']['output'];
  broadcasters: Array<Broadcaster>;
  lifetimeJobCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type Client = User & {
  __typename?: 'Client';
  address: Address;
  addressId: Scalars['Int']['output'];
  agency: Agency;
  agencyId: Scalars['Int']['output'];
  contracts: Array<Contract>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  notifications: Array<Notification>;
  rut: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
  userState: UserState;
  validateEmail: ResultOfAppError;
  validateFirstName: ResultOfAppError;
  validateGoogleSignUp: ResultOfAppError;
  validateLastName: ResultOfAppError;
  validatePassword: ResultOfAppError;
  validateRUT: ResultOfAppError;
  validateSignUp: ResultOfAppError;
};

export type CompleteGoogleSignUpBroadcasterInput = {
  city: Scalars['String']['input'];
  countryCode: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  rut: Scalars['String']['input'];
  state: Scalars['String']['input'];
  street?: InputMaybe<Scalars['String']['input']>;
  subject: Scalars['String']['input'];
};

export type CompleteGoogleSignUpClientInput = {
  agencyName: Scalars['String']['input'];
  city: Scalars['String']['input'];
  countryCode: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  rut: Scalars['String']['input'];
  state: Scalars['String']['input'];
  street?: InputMaybe<Scalars['String']['input']>;
  subject: Scalars['String']['input'];
};

export type Contract = {
  __typename?: 'Contract';
  bills: Array<Bill>;
  broadcaster: Broadcaster;
  broadcasterId: Scalars['Int']['output'];
  client: Client;
  clientId: Scalars['Int']['output'];
  contractId: Scalars['Int']['output'];
  countryCode: Scalars['String']['output'];
  countryCodeNavigation: Country;
  date: Scalars['LocalDate']['output'];
  discountId?: Maybe<Scalars['Int']['output']>;
  discounts: Array<Discount>;
  dueDate: Scalars['LocalDate']['output'];
  pieces: Array<Piece>;
  price: Scalars['Decimal']['output'];
  termYears: Scalars['Int']['output'];
};

export type Country = {
  __typename?: 'Country';
  contracts: Array<Contract>;
  countryCode: Scalars['String']['output'];
  name: Scalars['String']['output'];
  region?: Maybe<Region>;
  regionId?: Maybe<Scalars['Int']['output']>;
};

export type Demo = {
  __typename?: 'Demo';
  broadcaster: Broadcaster;
  broadcasterId: Scalars['Int']['output'];
  fileName: Scalars['String']['output'];
};

export type Discount = {
  __typename?: 'Discount';
  amount: Scalars['Decimal']['output'];
  contracts: Array<Contract>;
  discountId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export enum ErrorKind {
  Conflict = 'CONFLICT',
  Forbidden = 'FORBIDDEN',
  Internal = 'INTERNAL',
  NotFound = 'NOT_FOUND',
  Unauthorized = 'UNAUTHORIZED',
  Validation = 'VALIDATION'
}

export type ExtraCharge = {
  __typename?: 'ExtraCharge';
  amount: Scalars['Decimal']['output'];
  extraChargeId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  pieces: Array<Piece>;
};

export type GoogleAuth = {
  __typename?: 'GoogleAuth';
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  requiresRegistration: Scalars['Boolean']['output'];
  subject?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
};

export type GoogleAuthInput = {
  code: Scalars['String']['input'];
};

export type Membership = {
  __typename?: 'Membership';
  amount?: Maybe<Scalars['Decimal']['output']>;
  broadcaster: Broadcaster;
  broadcasterId: Scalars['Int']['output'];
  dueDate?: Maybe<Scalars['LocalDate']['output']>;
  membershipId: Scalars['Int']['output'];
  payDate?: Maybe<Scalars['LocalDate']['output']>;
  state: MembershipState;
};

export enum MembershipState {
  Expired = 'EXPIRED',
  Valid = 'VALID'
}

export type Mutation = {
  __typename?: 'Mutation';
  completeGoogleSignUpBroadcaster: AuthPayload;
  completeGoogleSignUpClient: AuthPayload;
  googleAuth: GoogleAuth;
  login: AuthPayload;
  registerBroadcaster: AuthPayload;
  registerClient: AuthPayload;
};


export type MutationCompleteGoogleSignUpBroadcasterArgs = {
  input: CompleteGoogleSignUpBroadcasterInput;
};


export type MutationCompleteGoogleSignUpClientArgs = {
  input: CompleteGoogleSignUpClientInput;
};


export type MutationGoogleAuthArgs = {
  input: GoogleAuthInput;
};


export type MutationLoginArgs = {
  input: UserLoginInput;
};


export type MutationRegisterBroadcasterArgs = {
  input: RegisterBroadcasterInput;
};


export type MutationRegisterClientArgs = {
  input: RegisterClientInput;
};

export type Notification = {
  __typename?: 'Notification';
  date: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  isRead?: Maybe<Scalars['Boolean']['output']>;
  notificationId: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export type Piece = {
  __typename?: 'Piece';
  contract: Contract;
  contractId: Scalars['Int']['output'];
  extraCharges: Array<ExtraCharge>;
  name: Scalars['String']['output'];
  pieceId: Scalars['Int']['output'];
  service: Service;
  serviceId: Scalars['Int']['output'];
  variants: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  countries: Array<Country>;
  /** Healthcheck */
  ping: Scalars['String']['output'];
  users: Array<User>;
};

export type Region = {
  __typename?: 'Region';
  countries: Array<Country>;
  multiplier: Scalars['Decimal']['output'];
  regionId: Scalars['Int']['output'];
};

export type RegisterBroadcasterInput = {
  city: Scalars['String']['input'];
  countryCode: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  rut: Scalars['String']['input'];
  state: Scalars['String']['input'];
  street?: InputMaybe<Scalars['String']['input']>;
};

export type RegisterClientInput = {
  agencyName: Scalars['String']['input'];
  city: Scalars['String']['input'];
  countryCode: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  rut: Scalars['String']['input'];
  state: Scalars['String']['input'];
  street?: InputMaybe<Scalars['String']['input']>;
};

export type ResultOfAppError = {
  __typename?: 'ResultOfAppError';
  error?: Maybe<AppError>;
  errors: Array<AppError>;
  isFailure: Scalars['Boolean']['output'];
  isSuccess: Scalars['Boolean']['output'];
};

export type Service = {
  __typename?: 'Service';
  name: Scalars['String']['output'];
  pieces: Array<Piece>;
  serviceId: Scalars['Int']['output'];
  volumeDiscounts: Array<VolumeDiscount>;
};

export type User = {
  address: Address;
  addressId: Scalars['Int']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  notifications: Array<Notification>;
  rut: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
  userState: UserState;
  validateEmail: ResultOfAppError;
  validateFirstName: ResultOfAppError;
  validateGoogleSignUp: ResultOfAppError;
  validateLastName: ResultOfAppError;
  validatePassword: ResultOfAppError;
  validateRUT: ResultOfAppError;
  validateSignUp: ResultOfAppError;
};

export type UserLoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export enum UserState {
  Enabled = 'ENABLED',
  Penalized = 'PENALIZED',
  Pending = 'PENDING'
}

export type VolumeDiscount = {
  __typename?: 'VolumeDiscount';
  discount: Scalars['Decimal']['output'];
  minQuantity: Scalars['Int']['output'];
  service: Service;
  serviceId: Scalars['Int']['output'];
};
