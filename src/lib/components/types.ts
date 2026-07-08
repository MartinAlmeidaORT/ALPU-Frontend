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
  type: string;
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
  date: CalendarDate | undefined;
}

export interface ServiceIvrUI extends BaseService {
  messageText: string;
  additionalMessages: number;
  isInterior: boolean;
  priceOverride: number | null;
  updates: number | null;
  date: CalendarDate | undefined;
}

export interface ServiceEventUI extends BaseService {
  forMassBroadcast: boolean;
  date: CalendarDate | undefined;
}
