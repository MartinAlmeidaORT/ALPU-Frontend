import type { Interval } from '$lib/graphql/schema';
import type { CalendarDate } from '@internationalized/date';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  state: string;
}

export interface BaseService {
  id: number;
  pieces: Piece[];
}

export interface Piece {
  name: string;
}

export interface ServicePeriodUI extends BaseService {
  period: Interval | null;
  isInterior: boolean;
  isInternalUse: boolean;
}

export interface ServiceNarrativeUI extends BaseService {
  isNonCommercialContent: boolean;
  isInternetBroadcast: boolean;
  narrativeMinutes: number;
  isPriceSuggested: number | null;
  isExtraRoles: number | null;
  isLipSync: boolean;
  date: CalendarDate | null;
}

export interface ServiceIvrUI extends BaseService {
  messageText: string;
  additionalMessages: number;
  isInterior: boolean;
  priceOverride: number | null;
  updates: number | null;
  date: CalendarDate | null;
}

export interface ServiceEventUI extends BaseService {
  ForMassBroadcast: boolean;
  date: CalendarDate | null;
}
