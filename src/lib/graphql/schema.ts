export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Decimal: { input: unknown; output: unknown; }
  LocalDate: { input: unknown; output: unknown; }
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String']['output'];
  country: Country;
  countryCode: Scalars['String']['output'];
  state: Scalars['String']['output'];
  street?: Maybe<Scalars['String']['output']>;
};

export type Agency = {
  __typename?: 'Agency';
  agencyId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
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
  address?: Maybe<Address>;
  category: BroadcasterCategory;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  rut: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
  userState: UserState;
};

export type BroadcasterCategory = {
  __typename?: 'BroadcasterCategory';
  broadcasterCategoryId: Scalars['Int']['output'];
  broadcasters: Array<Broadcaster>;
  lifetimeJobCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type CalculateContractInput = {
  broadcasterId: Scalars['Int']['input'];
  clientId: Scalars['Int']['input'];
  services: Array<CalculateContractServiceInput>;
};

export type CalculateContractPayload = {
  __typename?: 'CalculateContractPayload';
  servicePrice: Array<ServicePricePayload>;
  totalPrice: Scalars['Decimal']['output'];
};

export type CalculateContractServiceInput = {
  options: ServiceFlagsInput;
  pieceName: Scalars['String']['input'];
  serviceId: Scalars['Int']['input'];
};

export type Client = User & {
  __typename?: 'Client';
  address?: Maybe<Address>;
  agency?: Maybe<Agency>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  rut: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
  userState: UserState;
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
  countryCode: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Discount = {
  __typename?: 'Discount';
  amount: Scalars['Decimal']['output'];
  contracts: Array<Contract>;
  discountId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type Duration = {
  __typename?: 'Duration';
  durationId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  servicePrices: Array<ServicePrice>;
  time: Scalars['Int']['output'];
};

export type DurationSortInput = {
  durationId?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  time?: InputMaybe<SortEnumType>;
};

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

export type Mutation = {
  __typename?: 'Mutation';
  calculateContract: CalculateContractPayload;
  completeGoogleSignUpBroadcaster: AuthPayload;
  completeGoogleSignUpClient: AuthPayload;
  googleAuth: GoogleAuth;
  login: AuthPayload;
  registerBroadcaster: AuthPayload;
  registerClient: AuthPayload;
};


export type MutationCalculateContractArgs = {
  input: CalculateContractInput;
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

export type Piece = {
  __typename?: 'Piece';
  contract: Contract;
  contractId?: Maybe<Scalars['Int']['output']>;
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
  services: Array<Service>;
  users: Array<User>;
};


export type QueryServicesArgs = {
  order?: InputMaybe<Array<ServiceSortInput>>;
};

export type RangeIvr = {
  __typename?: 'RangeIVR';
  maxWord?: Maybe<Scalars['Int']['output']>;
  minWord: Scalars['Int']['output'];
  pricePerWord: Scalars['Decimal']['output'];
  service: ServiceIvr;
  serviceId: Scalars['Int']['output'];
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

export type Service = {
  name: Scalars['String']['output'];
  pieces: Array<Piece>;
  serviceId: Scalars['Int']['output'];
  volumeDiscounts: Array<VolumeDiscount>;
};

export type ServiceDuration = Service & {
  __typename?: 'ServiceDuration';
  name: Scalars['String']['output'];
  pieces: Array<Piece>;
  serviceId: Scalars['Int']['output'];
  servicePrices: Array<ServicePrice>;
  volumeDiscounts: Array<VolumeDiscount>;
};


export type ServiceDurationServicePricesArgs = {
  order?: InputMaybe<Array<ServicePriceSortInput>>;
};

export type ServiceDurationSortInput = {
  name?: InputMaybe<SortEnumType>;
  serviceId?: InputMaybe<SortEnumType>;
};

export type ServiceFlagPayload = {
  __typename?: 'ServiceFlagPayload';
  isOn: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
};

export type ServiceFlags = {
  __typename?: 'ServiceFlags';
  additionalMessageIVR?: Maybe<Scalars['Int']['output']>;
  durationId?: Maybe<Scalars['Int']['output']>;
  hasInternetPromo?: Maybe<Scalars['Boolean']['output']>;
  hasLipSync?: Maybe<Scalars['Boolean']['output']>;
  hasMassMediaBroadcast?: Maybe<Scalars['Boolean']['output']>;
  hasMedia?: Maybe<Scalars['Boolean']['output']>;
  isInterior?: Maybe<Scalars['Boolean']['output']>;
  isNonComercial?: Maybe<Scalars['Boolean']['output']>;
  messageIVR?: Maybe<Scalars['String']['output']>;
  multipleBroadcaster?: Maybe<Scalars['Boolean']['output']>;
  narrativeMinutes?: Maybe<Scalars['Int']['output']>;
  overridePrice?: Maybe<Scalars['Decimal']['output']>;
  pieces?: Maybe<Scalars['Int']['output']>;
  roleQuantity?: Maybe<Scalars['Int']['output']>;
};

export type ServiceFlagsInput = {
  additionalMessageIVR?: InputMaybe<Scalars['Int']['input']>;
  durationId?: InputMaybe<Scalars['Int']['input']>;
  hasInternetPromo?: InputMaybe<Scalars['Boolean']['input']>;
  hasLipSync?: InputMaybe<Scalars['Boolean']['input']>;
  hasMassMediaBroadcast?: InputMaybe<Scalars['Boolean']['input']>;
  hasMedia?: InputMaybe<Scalars['Boolean']['input']>;
  isInterior?: InputMaybe<Scalars['Boolean']['input']>;
  isNonComercial?: InputMaybe<Scalars['Boolean']['input']>;
  messageIVR?: InputMaybe<Scalars['String']['input']>;
  multipleBroadcaster?: InputMaybe<Scalars['Boolean']['input']>;
  narrativeMinutes?: InputMaybe<Scalars['Int']['input']>;
  overridePrice?: InputMaybe<Scalars['Decimal']['input']>;
  pieces?: InputMaybe<Scalars['Int']['input']>;
  roleQuantity?: InputMaybe<Scalars['Int']['input']>;
};

export type ServiceIvr = Service & {
  __typename?: 'ServiceIVR';
  additionalMessagePrice: Scalars['Decimal']['output'];
  initialMessagePrice: Scalars['Decimal']['output'];
  name: Scalars['String']['output'];
  pieces: Array<Piece>;
  rangeIVR: Array<RangeIvr>;
  serviceId: Scalars['Int']['output'];
  updateMessagePrice: Scalars['Decimal']['output'];
  volumeDiscounts: Array<VolumeDiscount>;
};

export type ServiceNarrative = Service & {
  __typename?: 'ServiceNarrative';
  basePrice: Scalars['Decimal']['output'];
  extraPrice: Scalars['Decimal']['output'];
  name: Scalars['String']['output'];
  pieces: Array<Piece>;
  rolPrice: Scalars['Decimal']['output'];
  serviceId: Scalars['Int']['output'];
  volumeDiscounts: Array<VolumeDiscount>;
};

export type ServicePrice = {
  __typename?: 'ServicePrice';
  duration: Duration;
  durationId: Scalars['Int']['output'];
  price: Scalars['Decimal']['output'];
  service: ServiceDuration;
  serviceId: Scalars['Int']['output'];
  variantPrice?: Maybe<Scalars['Decimal']['output']>;
};

export type ServicePricePayload = {
  __typename?: 'ServicePricePayload';
  discount: Scalars['Decimal']['output'];
  durationId?: Maybe<Scalars['Int']['output']>;
  pieceName: Scalars['String']['output'];
  price: Scalars['Decimal']['output'];
  service: Scalars['String']['output'];
  serviceFlags: Array<ServiceFlagPayload>;
  totalPriceWithDiscount: Scalars['Decimal']['output'];
  variants?: Maybe<Scalars['Int']['output']>;
};

export type ServicePriceSortInput = {
  duration?: InputMaybe<DurationSortInput>;
  durationId?: InputMaybe<SortEnumType>;
  price?: InputMaybe<SortEnumType>;
  service?: InputMaybe<ServiceDurationSortInput>;
  serviceId?: InputMaybe<SortEnumType>;
  variantPrice?: InputMaybe<SortEnumType>;
};

export type ServiceSortInput = {
  name?: InputMaybe<SortEnumType>;
  serviceId?: InputMaybe<SortEnumType>;
};

export type ServiceSpecial = Service & {
  __typename?: 'ServiceSpecial';
  name: Scalars['String']['output'];
  pieces: Array<Piece>;
  price: Scalars['Decimal']['output'];
  serviceId: Scalars['Int']['output'];
  volumeDiscounts: Array<VolumeDiscount>;
};

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type User = {
  address?: Maybe<Address>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  rut: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
  userState: UserState;
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
