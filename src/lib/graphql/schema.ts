export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Any: { input: unknown; output: unknown; }
  DateTime: { input: unknown; output: unknown; }
  Decimal: { input: unknown; output: unknown; }
  JSON: { input: unknown; output: unknown; }
  LocalDate: { input: unknown; output: unknown; }
};

export type Accountant = User & {
  __typename?: 'Accountant';
  address?: Maybe<Address>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  rut: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
  userState: UserState;
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String']['output'];
  country: Country;
  countryCode: Scalars['String']['output'];
  department: Department;
  street?: Maybe<Scalars['String']['output']>;
};

export type AddressFilterInput = {
  addressId?: InputMaybe<IntOperationFilterInput>;
  and?: InputMaybe<Array<AddressFilterInput>>;
  city?: InputMaybe<StringOperationFilterInput>;
  country?: InputMaybe<CountryFilterInput>;
  countryCode?: InputMaybe<StringOperationFilterInput>;
  department?: InputMaybe<DepartmentFilterInput>;
  departmentId?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<AddressFilterInput>>;
  street?: InputMaybe<StringOperationFilterInput>;
};

export type AddressSortInput = {
  addressId?: InputMaybe<SortEnumType>;
  city?: InputMaybe<SortEnumType>;
  country?: InputMaybe<CountrySortInput>;
  countryCode?: InputMaybe<SortEnumType>;
  department?: InputMaybe<DepartmentSortInput>;
  departmentId?: InputMaybe<SortEnumType>;
  street?: InputMaybe<SortEnumType>;
};

export type Administrator = User & {
  __typename?: 'Administrator';
  address?: Maybe<Address>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  rut: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
  userState: UserState;
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

export type AgencySortInput = {
  agencyId?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
};

/** Defines when a policy shall be executed. */
export enum ApplyPolicy {
  /** After the resolver was executed. */
  AfterResolver = 'AFTER_RESOLVER',
  /** Before the resolver was executed. */
  BeforeResolver = 'BEFORE_RESOLVER',
  /** The policy is applied in the validation step before the execution. */
  Validation = 'VALIDATION'
}

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user?: Maybe<User>;
};

export type BaseCampaignService = {
  basePriceOverride?: Maybe<Scalars['Decimal']['output']>;
  campaign: Campaign;
  pieces: Array<Piece>;
  service: Service;
};

export type BaseCampaignServiceFilterInput = {
  and?: InputMaybe<Array<BaseCampaignServiceFilterInput>>;
  basePriceOverride?: InputMaybe<DecimalOperationFilterInput>;
  campaign?: InputMaybe<CampaignFilterInput>;
  campaignId?: InputMaybe<IntOperationFilterInput>;
  campaignServiceId?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<BaseCampaignServiceFilterInput>>;
  pieces?: InputMaybe<ListFilterInputTypeOfPieceFilterInput>;
  service?: InputMaybe<BaseServiceFilterInput>;
  serviceId?: InputMaybe<IntOperationFilterInput>;
};

export type BaseServiceFilterInput = {
  and?: InputMaybe<Array<BaseServiceFilterInput>>;
  basePrice?: InputMaybe<DecimalOperationFilterInput>;
  discriminator?: InputMaybe<StringOperationFilterInput>;
  extraPrice?: InputMaybe<DecimalOperationFilterInput>;
  firstExtraPrice?: InputMaybe<DecimalOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<BaseServiceFilterInput>>;
  serviceId?: InputMaybe<IntOperationFilterInput>;
  type?: InputMaybe<ServiceTypeOperationFilterInput>;
};

export type BaseServiceSortInput = {
  basePrice?: InputMaybe<SortEnumType>;
  discriminator?: InputMaybe<SortEnumType>;
  extraPrice?: InputMaybe<SortEnumType>;
  firstExtraPrice?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  serviceId?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
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

export type BroadcasterCategorySortInput = {
  broadcasterCategoryId?: InputMaybe<SortEnumType>;
  lifetimeJobCount?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
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
  fullName?: InputMaybe<StringOperationFilterInput>;
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

export type BroadcasterSortInput = {
  address?: InputMaybe<AddressSortInput>;
  addressId?: InputMaybe<SortEnumType>;
  category?: InputMaybe<BroadcasterCategorySortInput>;
  categoryId?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  firstName?: InputMaybe<SortEnumType>;
  fullName?: InputMaybe<SortEnumType>;
  googleId?: InputMaybe<SortEnumType>;
  lastName?: InputMaybe<SortEnumType>;
  password?: InputMaybe<SortEnumType>;
  rut?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
  userState?: InputMaybe<SortEnumType>;
};

export type CameraCampaignService = BaseCampaignService & PeriodCampaignService & {
  __typename?: 'CameraCampaignService';
  basePriceOverride?: Maybe<Scalars['Decimal']['output']>;
  campaign: Campaign;
  pieces: Array<Piece>;
  service: Service;
};

export type Campaign = {
  __typename?: 'Campaign';
  contract: Contract;
  name: Scalars['String']['output'];
  services: Array<BaseCampaignService>;
};

export type CampaignFilterInput = {
  and?: InputMaybe<Array<CampaignFilterInput>>;
  campaignId?: InputMaybe<IntOperationFilterInput>;
  contract?: InputMaybe<ContractFilterInput>;
  contractId?: InputMaybe<IntOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<CampaignFilterInput>>;
  services?: InputMaybe<ListFilterInputTypeOfBaseCampaignServiceFilterInput>;
};

export type CampaignInput = {
  broadcasterId: Scalars['Int']['input'];
  campaign: Scalars['String']['input'];
  clientId: Scalars['Int']['input'];
  countryCode: Scalars['String']['input'];
  inCash: Scalars['Boolean']['input'];
  services: Array<CampaignServiceInput>;
};

export type CampaignServiceInput = {
  options: Scalars['JSON']['input'];
  pieces: Array<PieceInput>;
  serviceId: Scalars['Int']['input'];
};

export type CinemaCampaignService = BaseCampaignService & PeriodCampaignService & {
  __typename?: 'CinemaCampaignService';
  basePriceOverride?: Maybe<Scalars['Decimal']['output']>;
  campaign: Campaign;
  pieces: Array<Piece>;
  service: Service;
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
  fullName?: InputMaybe<StringOperationFilterInput>;
  googleId?: InputMaybe<StringOperationFilterInput>;
  lastName?: InputMaybe<StringOperationFilterInput>;
  notifications?: InputMaybe<ListFilterInputTypeOfNotificationFilterInput>;
  or?: InputMaybe<Array<ClientFilterInput>>;
  password?: InputMaybe<StringOperationFilterInput>;
  rut?: InputMaybe<StringOperationFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
  userState?: InputMaybe<UserStateOperationFilterInput>;
};

export type ClientSortInput = {
  address?: InputMaybe<AddressSortInput>;
  addressId?: InputMaybe<SortEnumType>;
  agency?: InputMaybe<AgencySortInput>;
  agencyId?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  firstName?: InputMaybe<SortEnumType>;
  fullName?: InputMaybe<SortEnumType>;
  googleId?: InputMaybe<SortEnumType>;
  lastName?: InputMaybe<SortEnumType>;
  password?: InputMaybe<SortEnumType>;
  rut?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
  userState?: InputMaybe<SortEnumType>;
};

export type CompleteGoogleSignUpBroadcasterInput = {
  city: Scalars['String']['input'];
  countryCode: Scalars['String']['input'];
  departmentId: Scalars['Int']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  rut: Scalars['String']['input'];
  street?: InputMaybe<Scalars['String']['input']>;
  subject: Scalars['String']['input'];
};

export type CompleteGoogleSignUpClientInput = {
  agencyName: Scalars['String']['input'];
  city: Scalars['String']['input'];
  countryCode: Scalars['String']['input'];
  departmentId: Scalars['Int']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  rut: Scalars['String']['input'];
  street?: InputMaybe<Scalars['String']['input']>;
  subject: Scalars['String']['input'];
};

export type Contract = {
  __typename?: 'Contract';
  broadcaster: Broadcaster;
  broadcasterApproved: Scalars['Boolean']['output'];
  campaigns: Array<Campaign>;
  client: Client;
  clientApproved: Scalars['Boolean']['output'];
  contractId: Scalars['Int']['output'];
  country: Country;
  countryCode: Scalars['String']['output'];
  date: Scalars['LocalDate']['output'];
  dueDate: Scalars['LocalDate']['output'];
  state: ContractState;
};

export type ContractFilterInput = {
  and?: InputMaybe<Array<ContractFilterInput>>;
  bills?: InputMaybe<ListFilterInputTypeOfBillFilterInput>;
  broadcaster?: InputMaybe<BroadcasterFilterInput>;
  broadcasterApproved?: InputMaybe<BooleanOperationFilterInput>;
  broadcasterId?: InputMaybe<IntOperationFilterInput>;
  campaigns?: InputMaybe<ListFilterInputTypeOfCampaignFilterInput>;
  client?: InputMaybe<ClientFilterInput>;
  clientApproved?: InputMaybe<BooleanOperationFilterInput>;
  clientId?: InputMaybe<IntOperationFilterInput>;
  contractId?: InputMaybe<IntOperationFilterInput>;
  country?: InputMaybe<CountryFilterInput>;
  countryCode?: InputMaybe<StringOperationFilterInput>;
  date?: InputMaybe<LocalDateOperationFilterInput>;
  dueDate?: InputMaybe<LocalDateOperationFilterInput>;
  or?: InputMaybe<Array<ContractFilterInput>>;
  state?: InputMaybe<ContractStateOperationFilterInput>;
  termYears?: InputMaybe<IntOperationFilterInput>;
  totalPrice?: InputMaybe<DecimalOperationFilterInput>;
};

export type ContractSortInput = {
  broadcaster?: InputMaybe<BroadcasterSortInput>;
  broadcasterApproved?: InputMaybe<SortEnumType>;
  broadcasterId?: InputMaybe<SortEnumType>;
  client?: InputMaybe<ClientSortInput>;
  clientApproved?: InputMaybe<SortEnumType>;
  clientId?: InputMaybe<SortEnumType>;
  contractId?: InputMaybe<SortEnumType>;
  country?: InputMaybe<CountrySortInput>;
  countryCode?: InputMaybe<SortEnumType>;
  date?: InputMaybe<SortEnumType>;
  dueDate?: InputMaybe<SortEnumType>;
  state?: InputMaybe<SortEnumType>;
  termYears?: InputMaybe<SortEnumType>;
  totalPrice?: InputMaybe<SortEnumType>;
};

export enum ContractState {
  Approved = 'APPROVED',
  Canceled = 'CANCELED',
  Pending = 'PENDING'
}

export type ContractStateOperationFilterInput = {
  eq?: InputMaybe<ContractState>;
  in?: InputMaybe<Array<ContractState>>;
  neq?: InputMaybe<ContractState>;
  nin?: InputMaybe<Array<ContractState>>;
};

/** A connection to a list of items. */
export type ContractsConnection = {
  __typename?: 'ContractsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<ContractsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Contract>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type ContractsEdge = {
  __typename?: 'ContractsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Contract;
};

export type Country = {
  __typename?: 'Country';
  countryCode: Scalars['String']['output'];
  departments: Array<Department>;
  name: Scalars['String']['output'];
  region?: Maybe<Region>;
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

export type CountrySortInput = {
  countryCode?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  region?: InputMaybe<RegionSortInput>;
  regionId?: InputMaybe<SortEnumType>;
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

export type DepartmentSortInput = {
  country?: InputMaybe<CountrySortInput>;
  countryCode?: InputMaybe<SortEnumType>;
  departmentId?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
};

export type EventCampaignService = BaseCampaignService & {
  __typename?: 'EventCampaignService';
  basePriceOverride?: Maybe<Scalars['Decimal']['output']>;
  campaign: Campaign;
  date: Scalars['LocalDate']['output'];
  pieces: Array<Piece>;
  service: Service;
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

export enum Interval {
  OneMonth = 'ONE_MONTH',
  OneWeek = 'ONE_WEEK',
  OneYear = 'ONE_YEAR',
  SixMonths = 'SIX_MONTHS',
  ThreeMonths = 'THREE_MONTHS'
}

export type IvrCampaignService = BaseCampaignService & {
  __typename?: 'IvrCampaignService';
  basePriceOverride?: Maybe<Scalars['Decimal']['output']>;
  campaign: Campaign;
  pieces: Array<Piece>;
  service: Service;
};

export type ListFilterInputTypeOfBaseCampaignServiceFilterInput = {
  all?: InputMaybe<BaseCampaignServiceFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<BaseCampaignServiceFilterInput>;
  some?: InputMaybe<BaseCampaignServiceFilterInput>;
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

export type ListFilterInputTypeOfCampaignFilterInput = {
  all?: InputMaybe<CampaignFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<CampaignFilterInput>;
  some?: InputMaybe<CampaignFilterInput>;
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
  completeGoogleSignUpBroadcaster: AuthPayload;
  completeGoogleSignUpClient: AuthPayload;
  generateContract: Contract;
  googleAuth: GoogleAuth;
  login: AuthPayload;
  registerBroadcaster: AuthPayload;
  registerClient: AuthPayload;
  updateContractState?: Maybe<Contract>;
};


export type MutationCompleteGoogleSignUpBroadcasterArgs = {
  input: CompleteGoogleSignUpBroadcasterInput;
};


export type MutationCompleteGoogleSignUpClientArgs = {
  input: CompleteGoogleSignUpClientInput;
};


export type MutationGenerateContractArgs = {
  input: CampaignInput;
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


export type MutationUpdateContractStateArgs = {
  input: UpdateContractStateInput;
};

export type NarrativeCampaignService = BaseCampaignService & {
  __typename?: 'NarrativeCampaignService';
  basePriceOverride?: Maybe<Scalars['Decimal']['output']>;
  campaign: Campaign;
  pieces: Array<Piece>;
  service: Service;
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

export type OtherMediaCampaignService = BaseCampaignService & PeriodCampaignService & {
  __typename?: 'OtherMediaCampaignService';
  basePriceOverride?: Maybe<Scalars['Decimal']['output']>;
  campaign: Campaign;
  pieces: Array<Piece>;
  service: Service;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** Indicates whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean']['output'];
  /** Indicates whether more edges exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Period = {
  __typename?: 'Period';
  basePrice: Scalars['Decimal']['output'];
  extraPrice?: Maybe<Scalars['Decimal']['output']>;
  firstExtraPrice?: Maybe<Scalars['Decimal']['output']>;
  interval: Interval;
  service: ServicePeriod;
  serviceId: Scalars['Int']['output'];
};

export type PeriodCampaignService = {
  basePriceOverride?: Maybe<Scalars['Decimal']['output']>;
  campaign: Campaign;
  pieces: Array<Piece>;
  service: Service;
};

export type PeriodServiceSortInput = {
  basePrice?: InputMaybe<SortEnumType>;
  discriminator?: InputMaybe<SortEnumType>;
  extraPrice?: InputMaybe<SortEnumType>;
  firstExtraPrice?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  serviceId?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
};

export type PeriodSortInput = {
  basePrice?: InputMaybe<SortEnumType>;
  extraPrice?: InputMaybe<SortEnumType>;
  firstExtraPrice?: InputMaybe<SortEnumType>;
  interval?: InputMaybe<SortEnumType>;
  service?: InputMaybe<PeriodServiceSortInput>;
  serviceId?: InputMaybe<SortEnumType>;
};

export type Piece = {
  __typename?: 'Piece';
  campaignService: BaseCampaignService;
  campaignServiceId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  pieceId: Scalars['Int']['output'];
};

export type PieceBreakdown = {
  __typename?: 'PieceBreakdown';
  isSubsequent: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Decimal']['output'];
};

export type PieceFilterInput = {
  and?: InputMaybe<Array<PieceFilterInput>>;
  campaignService?: InputMaybe<BaseCampaignServiceFilterInput>;
  campaignServiceId?: InputMaybe<IntOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PieceFilterInput>>;
  pieceId?: InputMaybe<IntOperationFilterInput>;
};

export type PieceInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type PriceAdjustmentBreakdown = {
  __typename?: 'PriceAdjustmentBreakdown';
  amount: Scalars['Decimal']['output'];
  applyDiscount: Scalars['Decimal']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: PriceAdjustmentType;
};

export enum PriceAdjustmentType {
  Fixed = 'FIXED',
  Percentage = 'PERCENTAGE'
}

export type PriceBreakdown = {
  __typename?: 'PriceBreakdown';
  adjustments: Array<PriceAdjustmentBreakdown>;
  beforeDiscount: Scalars['Decimal']['output'];
  services: Array<ServiceBreakdown>;
  total: Scalars['Decimal']['output'];
};

export type Query = {
  __typename?: 'Query';
  broadcasters: Array<Broadcaster>;
  calculateContract: PriceBreakdown;
  clients: Array<Client>;
  contracts?: Maybe<ContractsConnection>;
  countries: Array<Country>;
  departments: Array<Department>;
  /** Healthcheck */
  ping: Scalars['String']['output'];
  services: Array<Service>;
  users: Array<User>;
};


export type QueryBroadcastersArgs = {
  where?: InputMaybe<BroadcasterFilterInput>;
};


export type QueryCalculateContractArgs = {
  input: CampaignInput;
};


export type QueryClientsArgs = {
  where?: InputMaybe<ClientFilterInput>;
};


export type QueryContractsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<ContractSortInput>>;
};


export type QueryDepartmentsArgs = {
  where?: InputMaybe<DepartmentFilterInput>;
};


export type QueryServicesArgs = {
  order?: InputMaybe<Array<BaseServiceSortInput>>;
};


export type QueryUsersArgs = {
  where?: InputMaybe<UserFilterInput>;
};

export type RadioCampaignService = BaseCampaignService & PeriodCampaignService & {
  __typename?: 'RadioCampaignService';
  basePriceOverride?: Maybe<Scalars['Decimal']['output']>;
  campaign: Campaign;
  pieces: Array<Piece>;
  service: Service;
};

export type RangeIvr = {
  __typename?: 'RangeIvr';
  maxWord?: Maybe<Scalars['Int']['output']>;
  minWord: Scalars['Int']['output'];
  pricePerWord: Scalars['Decimal']['output'];
  service: ServiceIvr;
  serviceId: Scalars['Int']['output'];
};

export type Region = {
  __typename?: 'Region';
  countries: Array<Country>;
  multiplier: Scalars['Decimal']['output'];
  regionId: Scalars['Int']['output'];
};

export type RegionFilterInput = {
  and?: InputMaybe<Array<RegionFilterInput>>;
  countries?: InputMaybe<ListFilterInputTypeOfCountryFilterInput>;
  multiplier?: InputMaybe<DecimalOperationFilterInput>;
  or?: InputMaybe<Array<RegionFilterInput>>;
  regionId?: InputMaybe<IntOperationFilterInput>;
};

export type RegionSortInput = {
  multiplier?: InputMaybe<SortEnumType>;
  regionId?: InputMaybe<SortEnumType>;
};

export type RegisterBroadcasterInput = {
  city: Scalars['String']['input'];
  countryCode: Scalars['String']['input'];
  departmentId: Scalars['Int']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  rut: Scalars['String']['input'];
  street?: InputMaybe<Scalars['String']['input']>;
};

export type RegisterClientInput = {
  agencyName: Scalars['String']['input'];
  city: Scalars['String']['input'];
  countryCode: Scalars['String']['input'];
  departmentId: Scalars['Int']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  rut: Scalars['String']['input'];
  street?: InputMaybe<Scalars['String']['input']>;
};

export type Service = {
  basePrice?: Maybe<Scalars['Decimal']['output']>;
  extraPrice?: Maybe<Scalars['Decimal']['output']>;
  firstExtraPrice?: Maybe<Scalars['Decimal']['output']>;
  name: Scalars['String']['output'];
  serviceId: Scalars['Int']['output'];
  type: ServiceType;
};

export type ServiceBreakdown = {
  __typename?: 'ServiceBreakdown';
  adjustments: Array<PriceAdjustmentBreakdown>;
  basePrice: Scalars['Decimal']['output'];
  beforeDiscount: Scalars['Decimal']['output'];
  pieces: Array<PieceBreakdown>;
  serviceName: Scalars['String']['output'];
  serviceType: ServiceType;
  subTotal: Scalars['Decimal']['output'];
  subsequentPrice?: Maybe<Scalars['Decimal']['output']>;
  volumeDiscount?: Maybe<Scalars['Decimal']['output']>;
};

export type ServiceDate = Service & {
  __typename?: 'ServiceDate';
  basePrice?: Maybe<Scalars['Decimal']['output']>;
  extraPrice?: Maybe<Scalars['Decimal']['output']>;
  firstExtraPrice?: Maybe<Scalars['Decimal']['output']>;
  name: Scalars['String']['output'];
  serviceId: Scalars['Int']['output'];
  type: ServiceType;
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
  __typename?: 'ServiceIvr';
  additionalMessagePrice: Scalars['Decimal']['output'];
  basePrice?: Maybe<Scalars['Decimal']['output']>;
  extraPrice?: Maybe<Scalars['Decimal']['output']>;
  firstExtraPrice?: Maybe<Scalars['Decimal']['output']>;
  initialMessagePrice: Scalars['Decimal']['output'];
  name: Scalars['String']['output'];
  rangeIvr: Array<RangeIvr>;
  serviceId: Scalars['Int']['output'];
  type: ServiceType;
  updateMessagePrice: Scalars['Decimal']['output'];
};

export type ServiceNarrative = Service & {
  __typename?: 'ServiceNarrative';
  basePrice?: Maybe<Scalars['Decimal']['output']>;
  extraPrice?: Maybe<Scalars['Decimal']['output']>;
  firstExtraPrice?: Maybe<Scalars['Decimal']['output']>;
  name: Scalars['String']['output'];
  rolePrice: Scalars['Decimal']['output'];
  serviceId: Scalars['Int']['output'];
  type: ServiceType;
};

export type ServicePeriod = Service & {
  __typename?: 'ServicePeriod';
  basePrice?: Maybe<Scalars['Decimal']['output']>;
  extraPrice?: Maybe<Scalars['Decimal']['output']>;
  firstExtraPrice?: Maybe<Scalars['Decimal']['output']>;
  name: Scalars['String']['output'];
  periods: Array<Period>;
  serviceId: Scalars['Int']['output'];
  type: ServiceType;
};


export type ServicePeriodPeriodsArgs = {
  order?: InputMaybe<Array<PeriodSortInput>>;
};

export enum ServiceType {
  Camera = 'CAMERA',
  Cinema = 'CINEMA',
  Event = 'EVENT',
  InternetAudio = 'INTERNET_AUDIO',
  InternetVideo = 'INTERNET_VIDEO',
  Ivr = 'IVR',
  Narrative = 'NARRATIVE',
  Others = 'OTHERS',
  OthersAudio = 'OTHERS_AUDIO',
  OthersVideo = 'OTHERS_VIDEO',
  RadioGeneric = 'RADIO_GENERIC',
  RadioHost = 'RADIO_HOST',
  RadioZocalo = 'RADIO_ZOCALO',
  TvGeneric = 'TV_GENERIC',
  TvHost = 'TV_HOST',
  TvZocalo = 'TV_ZOCALO'
}

export type ServiceTypeOperationFilterInput = {
  eq?: InputMaybe<ServiceType>;
  in?: InputMaybe<Array<ServiceType>>;
  neq?: InputMaybe<ServiceType>;
  nin?: InputMaybe<Array<ServiceType>>;
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

export type Supervisor = User & {
  __typename?: 'Supervisor';
  address?: Maybe<Address>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  rut: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
  userState: UserState;
};

export type TvCampaignService = BaseCampaignService & PeriodCampaignService & {
  __typename?: 'TvCampaignService';
  basePriceOverride?: Maybe<Scalars['Decimal']['output']>;
  campaign: Campaign;
  pieces: Array<Piece>;
  service: Service;
};

export type UpdateContractStateInput = {
  contractId: Scalars['Int']['input'];
  newState: ContractState;
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
  fullName?: InputMaybe<StringOperationFilterInput>;
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
