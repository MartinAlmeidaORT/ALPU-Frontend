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
  city: Scalars['String']['output'];
  country: Country;
  countryCode: Scalars['String']['output'];
  state: Scalars['String']['output'];
  street?: Maybe<Scalars['String']['output']>;
};

export type AddressFilterInput = {
  addressId?: InputMaybe<IntOperationFilterInput>;
  and?: InputMaybe<Array<AddressFilterInput>>;
  city?: InputMaybe<StringOperationFilterInput>;
  country?: InputMaybe<CountryFilterInput>;
  countryCode?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<AddressFilterInput>>;
  state?: InputMaybe<StringOperationFilterInput>;
  street?: InputMaybe<StringOperationFilterInput>;
};

export type Agency = {
  __typename?: 'Agency';
  agencyId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type AgencyFilterInput = {
  agencyId?: InputMaybe<IntOperationFilterInput>;
  and?: InputMaybe<Array<AgencyFilterInput>>;
  clients?: InputMaybe<ListFilterInputTypeOfClientFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<AgencyFilterInput>>;
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

export type BillFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<BillFilterInput>>;
  billId?: InputMaybe<IntOperationFilterInput>;
  contract?: InputMaybe<ContractFilterInput>;
  contractId?: InputMaybe<IntOperationFilterInput>;
  date?: InputMaybe<LocalDateOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<BillFilterInput>>;
  proofFile?: InputMaybe<StringOperationFilterInput>;
  state?: InputMaybe<BillTypeOperationFilterInput>;
  title?: InputMaybe<StringOperationFilterInput>;
};

export enum BillType {
  Expense = 'EXPENSE',
  Income = 'INCOME'
}

export type BillTypeOperationFilterInput = {
  eq?: InputMaybe<BillType>;
  in?: InputMaybe<Array<BillType>>;
  neq?: InputMaybe<BillType>;
  nin?: InputMaybe<Array<BillType>>;
};

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  neq?: InputMaybe<Scalars['Boolean']['input']>;
};

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

export type BroadcasterCategoryFilterInput = {
  and?: InputMaybe<Array<BroadcasterCategoryFilterInput>>;
  broadcasterCategoryId?: InputMaybe<IntOperationFilterInput>;
  broadcasters?: InputMaybe<ListFilterInputTypeOfBroadcasterFilterInput>;
  lifetimeJobCount?: InputMaybe<IntOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<BroadcasterCategoryFilterInput>>;
};

export type BroadcasterFilterInput = {
  address?: InputMaybe<AddressFilterInput>;
  addressId?: InputMaybe<IntOperationFilterInput>;
  and?: InputMaybe<Array<BroadcasterFilterInput>>;
  category?: InputMaybe<BroadcasterCategoryFilterInput>;
  categoryId?: InputMaybe<IntOperationFilterInput>;
  contracts?: InputMaybe<ListFilterInputTypeOfContractFilterInput>;
  demos?: InputMaybe<ListFilterInputTypeOfDemoFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  firstName?: InputMaybe<StringOperationFilterInput>;
  googleId?: InputMaybe<StringOperationFilterInput>;
  lastName?: InputMaybe<StringOperationFilterInput>;
  memberships?: InputMaybe<ListFilterInputTypeOfMembershipFilterInput>;
  notifications?: InputMaybe<ListFilterInputTypeOfNotificationFilterInput>;
  or?: InputMaybe<Array<BroadcasterFilterInput>>;
  password?: InputMaybe<StringOperationFilterInput>;
  rut?: InputMaybe<StringOperationFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
  userState?: InputMaybe<UserStateOperationFilterInput>;
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

export type ClientFilterInput = {
  address?: InputMaybe<AddressFilterInput>;
  addressId?: InputMaybe<IntOperationFilterInput>;
  agency?: InputMaybe<AgencyFilterInput>;
  agencyId?: InputMaybe<IntOperationFilterInput>;
  and?: InputMaybe<Array<ClientFilterInput>>;
  contracts?: InputMaybe<ListFilterInputTypeOfContractFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  firstName?: InputMaybe<StringOperationFilterInput>;
  googleId?: InputMaybe<StringOperationFilterInput>;
  lastName?: InputMaybe<StringOperationFilterInput>;
  notifications?: InputMaybe<ListFilterInputTypeOfNotificationFilterInput>;
  or?: InputMaybe<Array<ClientFilterInput>>;
  password?: InputMaybe<StringOperationFilterInput>;
  rut?: InputMaybe<StringOperationFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
  userState?: InputMaybe<UserStateOperationFilterInput>;
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

export type ContractFilterInput = {
  and?: InputMaybe<Array<ContractFilterInput>>;
  bills?: InputMaybe<ListFilterInputTypeOfBillFilterInput>;
  broadcaster?: InputMaybe<BroadcasterFilterInput>;
  broadcasterId?: InputMaybe<IntOperationFilterInput>;
  client?: InputMaybe<ClientFilterInput>;
  clientId?: InputMaybe<IntOperationFilterInput>;
  contractId?: InputMaybe<IntOperationFilterInput>;
  countryCode?: InputMaybe<StringOperationFilterInput>;
  countryCodeNavigation?: InputMaybe<CountryFilterInput>;
  date?: InputMaybe<LocalDateOperationFilterInput>;
  discountId?: InputMaybe<IntOperationFilterInput>;
  discounts?: InputMaybe<ListFilterInputTypeOfDiscountFilterInput>;
  dueDate?: InputMaybe<LocalDateOperationFilterInput>;
  or?: InputMaybe<Array<ContractFilterInput>>;
  pieces?: InputMaybe<ListFilterInputTypeOfPieceFilterInput>;
  price?: InputMaybe<DecimalOperationFilterInput>;
  termYears?: InputMaybe<IntOperationFilterInput>;
};

export type Country = {
  __typename?: 'Country';
  countryCode: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CountryFilterInput = {
  and?: InputMaybe<Array<CountryFilterInput>>;
  contracts?: InputMaybe<ListFilterInputTypeOfContractFilterInput>;
  countryCode?: InputMaybe<StringOperationFilterInput>;
  departments?: InputMaybe<ListFilterInputTypeOfDepartmentFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<CountryFilterInput>>;
  region?: InputMaybe<RegionFilterInput>;
  regionId?: InputMaybe<IntOperationFilterInput>;
};

export type DateTimeOperationFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  neq?: InputMaybe<Scalars['DateTime']['input']>;
  ngt?: InputMaybe<Scalars['DateTime']['input']>;
  ngte?: InputMaybe<Scalars['DateTime']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  nlt?: InputMaybe<Scalars['DateTime']['input']>;
  nlte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DecimalOperationFilterInput = {
  eq?: InputMaybe<Scalars['Decimal']['input']>;
  gt?: InputMaybe<Scalars['Decimal']['input']>;
  gte?: InputMaybe<Scalars['Decimal']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Decimal']['input']>>>;
  lt?: InputMaybe<Scalars['Decimal']['input']>;
  lte?: InputMaybe<Scalars['Decimal']['input']>;
  neq?: InputMaybe<Scalars['Decimal']['input']>;
  ngt?: InputMaybe<Scalars['Decimal']['input']>;
  ngte?: InputMaybe<Scalars['Decimal']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Decimal']['input']>>>;
  nlt?: InputMaybe<Scalars['Decimal']['input']>;
  nlte?: InputMaybe<Scalars['Decimal']['input']>;
};

export type DemoFilterInput = {
  and?: InputMaybe<Array<DemoFilterInput>>;
  broadcaster?: InputMaybe<BroadcasterFilterInput>;
  broadcasterId?: InputMaybe<IntOperationFilterInput>;
  fileName?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<DemoFilterInput>>;
};

export type Department = {
  __typename?: 'Department';
  country: Country;
  countryCode: Scalars['String']['output'];
  departmentId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type DepartmentFilterInput = {
  and?: InputMaybe<Array<DepartmentFilterInput>>;
  country?: InputMaybe<CountryFilterInput>;
  countryCode?: InputMaybe<StringOperationFilterInput>;
  departmentId?: InputMaybe<IntOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<DepartmentFilterInput>>;
};

export type Discount = {
  __typename?: 'Discount';
  amount: Scalars['Decimal']['output'];
  contracts: Array<Contract>;
  discountId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type DiscountFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<DiscountFilterInput>>;
  contracts?: InputMaybe<ListFilterInputTypeOfContractFilterInput>;
  discountId?: InputMaybe<IntOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<DiscountFilterInput>>;
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

export type ExtraChargeFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<ExtraChargeFilterInput>>;
  extraChargeId?: InputMaybe<IntOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ExtraChargeFilterInput>>;
  pieces?: InputMaybe<ListFilterInputTypeOfPieceFilterInput>;
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

export type IntOperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
  ngt?: InputMaybe<Scalars['Int']['input']>;
  ngte?: InputMaybe<Scalars['Int']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  nlt?: InputMaybe<Scalars['Int']['input']>;
  nlte?: InputMaybe<Scalars['Int']['input']>;
};

export type ListFilterInputTypeOfBillFilterInput = {
  all?: InputMaybe<BillFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<BillFilterInput>;
  some?: InputMaybe<BillFilterInput>;
};

export type ListFilterInputTypeOfBroadcasterFilterInput = {
  all?: InputMaybe<BroadcasterFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<BroadcasterFilterInput>;
  some?: InputMaybe<BroadcasterFilterInput>;
};

export type ListFilterInputTypeOfClientFilterInput = {
  all?: InputMaybe<ClientFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ClientFilterInput>;
  some?: InputMaybe<ClientFilterInput>;
};

export type ListFilterInputTypeOfContractFilterInput = {
  all?: InputMaybe<ContractFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ContractFilterInput>;
  some?: InputMaybe<ContractFilterInput>;
};

export type ListFilterInputTypeOfCountryFilterInput = {
  all?: InputMaybe<CountryFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<CountryFilterInput>;
  some?: InputMaybe<CountryFilterInput>;
};

export type ListFilterInputTypeOfDemoFilterInput = {
  all?: InputMaybe<DemoFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<DemoFilterInput>;
  some?: InputMaybe<DemoFilterInput>;
};

export type ListFilterInputTypeOfDepartmentFilterInput = {
  all?: InputMaybe<DepartmentFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<DepartmentFilterInput>;
  some?: InputMaybe<DepartmentFilterInput>;
};

export type ListFilterInputTypeOfDiscountFilterInput = {
  all?: InputMaybe<DiscountFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<DiscountFilterInput>;
  some?: InputMaybe<DiscountFilterInput>;
};

export type ListFilterInputTypeOfExtraChargeFilterInput = {
  all?: InputMaybe<ExtraChargeFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ExtraChargeFilterInput>;
  some?: InputMaybe<ExtraChargeFilterInput>;
};

export type ListFilterInputTypeOfMembershipFilterInput = {
  all?: InputMaybe<MembershipFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<MembershipFilterInput>;
  some?: InputMaybe<MembershipFilterInput>;
};

export type ListFilterInputTypeOfNotificationFilterInput = {
  all?: InputMaybe<NotificationFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<NotificationFilterInput>;
  some?: InputMaybe<NotificationFilterInput>;
};

export type ListFilterInputTypeOfPieceFilterInput = {
  all?: InputMaybe<PieceFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<PieceFilterInput>;
  some?: InputMaybe<PieceFilterInput>;
};

export type ListFilterInputTypeOfVolumeDiscountFilterInput = {
  all?: InputMaybe<VolumeDiscountFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<VolumeDiscountFilterInput>;
  some?: InputMaybe<VolumeDiscountFilterInput>;
};

export type LocalDateOperationFilterInput = {
  eq?: InputMaybe<Scalars['LocalDate']['input']>;
  gt?: InputMaybe<Scalars['LocalDate']['input']>;
  gte?: InputMaybe<Scalars['LocalDate']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['LocalDate']['input']>>>;
  lt?: InputMaybe<Scalars['LocalDate']['input']>;
  lte?: InputMaybe<Scalars['LocalDate']['input']>;
  neq?: InputMaybe<Scalars['LocalDate']['input']>;
  ngt?: InputMaybe<Scalars['LocalDate']['input']>;
  ngte?: InputMaybe<Scalars['LocalDate']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['LocalDate']['input']>>>;
  nlt?: InputMaybe<Scalars['LocalDate']['input']>;
  nlte?: InputMaybe<Scalars['LocalDate']['input']>;
};

export type MembershipFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<MembershipFilterInput>>;
  broadcaster?: InputMaybe<BroadcasterFilterInput>;
  broadcasterId?: InputMaybe<IntOperationFilterInput>;
  dueDate?: InputMaybe<LocalDateOperationFilterInput>;
  membershipId?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<MembershipFilterInput>>;
  payDate?: InputMaybe<LocalDateOperationFilterInput>;
  state?: InputMaybe<MembershipStateOperationFilterInput>;
};

export enum MembershipState {
  Expired = 'EXPIRED',
  Valid = 'VALID'
}

export type MembershipStateOperationFilterInput = {
  eq?: InputMaybe<MembershipState>;
  in?: InputMaybe<Array<MembershipState>>;
  neq?: InputMaybe<MembershipState>;
  nin?: InputMaybe<Array<MembershipState>>;
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

export type NotificationFilterInput = {
  and?: InputMaybe<Array<NotificationFilterInput>>;
  date?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  isRead?: InputMaybe<BooleanOperationFilterInput>;
  notificationId?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<NotificationFilterInput>>;
  title?: InputMaybe<StringOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
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

export type PieceFilterInput = {
  and?: InputMaybe<Array<PieceFilterInput>>;
  contract?: InputMaybe<ContractFilterInput>;
  contractId?: InputMaybe<IntOperationFilterInput>;
  extraCharges?: InputMaybe<ListFilterInputTypeOfExtraChargeFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PieceFilterInput>>;
  pieceId?: InputMaybe<IntOperationFilterInput>;
  service?: InputMaybe<ServiceFilterInput>;
  serviceId?: InputMaybe<IntOperationFilterInput>;
  variants?: InputMaybe<IntOperationFilterInput>;
};

export type Query = {
  __typename?: 'Query';
  countries: Array<Country>;
  departments: Array<Department>;
  /** Healthcheck */
  ping: Scalars['String']['output'];
  services: Array<Service>;
  users: Array<User>;
};


export type QueryDepartmentsArgs = {
  where?: InputMaybe<DepartmentFilterInput>;
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

export type RegionFilterInput = {
  and?: InputMaybe<Array<RegionFilterInput>>;
  countries?: InputMaybe<ListFilterInputTypeOfCountryFilterInput>;
  multiplier?: InputMaybe<DecimalOperationFilterInput>;
  or?: InputMaybe<Array<RegionFilterInput>>;
  regionId?: InputMaybe<IntOperationFilterInput>;
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

export type ServiceFilterInput = {
  and?: InputMaybe<Array<ServiceFilterInput>>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ServiceFilterInput>>;
  pieces?: InputMaybe<ListFilterInputTypeOfPieceFilterInput>;
  serviceId?: InputMaybe<IntOperationFilterInput>;
  volumeDiscounts?: InputMaybe<ListFilterInputTypeOfVolumeDiscountFilterInput>;
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

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ncontains?: InputMaybe<Scalars['String']['input']>;
  nendsWith?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nstartsWith?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  address?: Maybe<Address>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  rut: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
  userState: UserState;
};

export type UserFilterInput = {
  address?: InputMaybe<AddressFilterInput>;
  addressId?: InputMaybe<IntOperationFilterInput>;
  and?: InputMaybe<Array<UserFilterInput>>;
  email?: InputMaybe<StringOperationFilterInput>;
  firstName?: InputMaybe<StringOperationFilterInput>;
  googleId?: InputMaybe<StringOperationFilterInput>;
  lastName?: InputMaybe<StringOperationFilterInput>;
  notifications?: InputMaybe<ListFilterInputTypeOfNotificationFilterInput>;
  or?: InputMaybe<Array<UserFilterInput>>;
  password?: InputMaybe<StringOperationFilterInput>;
  rut?: InputMaybe<StringOperationFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
  userState?: InputMaybe<UserStateOperationFilterInput>;
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

export type UserStateOperationFilterInput = {
  eq?: InputMaybe<UserState>;
  in?: InputMaybe<Array<UserState>>;
  neq?: InputMaybe<UserState>;
  nin?: InputMaybe<Array<UserState>>;
};

export type VolumeDiscount = {
  __typename?: 'VolumeDiscount';
  discount: Scalars['Decimal']['output'];
  minQuantity: Scalars['Int']['output'];
  service: Service;
  serviceId: Scalars['Int']['output'];
};

export type VolumeDiscountFilterInput = {
  and?: InputMaybe<Array<VolumeDiscountFilterInput>>;
  discount?: InputMaybe<DecimalOperationFilterInput>;
  minQuantity?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<VolumeDiscountFilterInput>>;
  service?: InputMaybe<ServiceFilterInput>;
  serviceId?: InputMaybe<IntOperationFilterInput>;
};
