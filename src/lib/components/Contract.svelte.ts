import {
  ServiceType,
  type CampaignInput,
  type Interval,
  type Service,
} from '$lib/graphql/schema';
import type { CampaignServiceInput } from '$lib/graphql/types/graphql';
import type { CalendarDate } from '@internationalized/date';
 
export class Contract {
  contractSerial= $state<string | null>(null);
  clientId = $state<number>(0);
  broadcasterId = $state<number>(0);
  campaignName= $state<string | null>(null);
  countryCode = $state<string | undefined>(undefined);
  services= $state<BaseServiceUI[]>([]);
 
  constructor() {
    this.contractSerial = null;
    this.clientId = 0;
    this.broadcasterId = 0;
    this.campaignName = null;
    this.countryCode = undefined;
    this.services = [];
  }
 
  addOrUpdateService(service: BaseServiceUI): void {
    this.services = this.services.filter((s) => s.id !== service.id);
    this.services.push(service);
  }
 
  removeService(index: number): void {
    this.services[index]?.reset();
    this.services = this.services.filter((_, i) => i !== index);
  }
 
  removeAllServices(): void {
    this.services.forEach((s) => s.reset());
    this.services = [];
  }
 
  removePiece(serviceIndex: number, pieceIndex: number): void {
    const service = this.services[serviceIndex];
    if (!service) return;
    service.pieces = service.pieces.filter((_, i) => i !== pieceIndex);
  }
 
  toInput(): CampaignInput {
    return {
      campaign: this.campaignName ?? '',
      contractSerial: this.contractSerial,
      clientId: this.clientId ?? 0,
      broadcasterId: this.broadcasterId ?? 0,
      countryCode: this.countryCode ?? '',
      services: this.services.map((s) => s.toInput()),
    };
  }
}
 
export class BaseServiceUI {
  id: number;
  pieces = $state<Piece[]>([]);
  type: string | null;
 
  constructor(service: Service) {
    this.id = service.serviceId;
    this.pieces = [];
    this.type = service.type;
  }
 
  reset(): void {
    this.pieces = [];
  }
 
  toInput(): CampaignServiceInput {
    return {
      serviceId: this.id,
      pieces: this.pieces,
      options: {},
    };
  }
}
 
export class ServicePeriodUI extends BaseServiceUI {
  period = $state<Interval | null>(null);
  isInterior = $state<boolean>(false);
  isInternalUse = $state<boolean>(false);
 
  constructor(service: Service) {
    super(service);
    this.period = null;
    this.isInterior = false;
    this.isInternalUse = false;
  }
 
  reset(): void {
    super.reset();
    this.period = null;
    this.isInterior = false;
    this.isInternalUse = false;
  }
 
  toInput(): CampaignServiceInput {
    switch (this.type) {
      case ServiceType.TvGeneric:
      case ServiceType.RadioGeneric:
      case ServiceType.Cinema:
      case ServiceType.TvZocalo:
      case ServiceType.RadioZocalo:
      case ServiceType.TvHost:
      case ServiceType.RadioHost:
        return {
          serviceId: this.id,
          pieces: this.pieces,
          options: {
            period: this.period,
            isInterior: this.isInterior,
          },
        };
      case ServiceType.InternetVideo:
      case ServiceType.InternetAudio:
      case ServiceType.OthersVideo:
      case ServiceType.OthersAudio:
      case ServiceType.Others:
        return {
          serviceId: this.id,
          pieces: this.pieces,
          options: {
            period: this.period,
          },
        };
      default:
        throw new Error(`Invalid service type: ${this.type}`);
    }
  }
}
 
export class ServiceNarrativeUI extends BaseServiceUI {
  isNonCommercialContent = $state<boolean>(false);
  isInternetBroadcast = $state<boolean>(false);
  narrativeMinutes = $state<number>(0);
  isPriceSuggested = $state<number | null>(null);
  isExtraRoles = $state<number>(0);
  isLipSync = $state<boolean>(false);
  date = $state<CalendarDate | undefined>(undefined);
 
  constructor(service: Service) {
    super(service);
    this.isNonCommercialContent = false;
    this.isInternetBroadcast = false;
    this.narrativeMinutes = 0;
    this.isPriceSuggested = null;
    this.isExtraRoles = 0;
    this.isLipSync = false;
    this.date = undefined;
  }
 
  reset(): void {
    super.reset();
    this.isNonCommercialContent = false;
    this.isInternetBroadcast = false;
    this.narrativeMinutes = 0;
    this.isPriceSuggested = null;
    this.isExtraRoles = 0;
    this.isLipSync = false;
    this.date = undefined;
  }
 
  toInput(): CampaignServiceInput {
    return {
      serviceId: this.id,
      pieces: this.pieces,
      options: {
        minutes: this.narrativeMinutes,
        extraRoles: this.isExtraRoles,
        isNonCommercial: this.isNonCommercialContent,
        onInternet: this.isInternetBroadcast,
        hasLipSync: this.isLipSync,
        priceOverride: this.isPriceSuggested,
        date: this.date?.toString(),
      },
    };
  }
}
 
export class ServiceIvrUI extends BaseServiceUI {
  messageText = $state<string | null>(null);
  additionalMessages = $state<number>(0);
  isInterior = $state<boolean>(false);
  priceOverride = $state<number | null>(null);
  updates = $state<number>(0);
  date = $state<CalendarDate | undefined>(undefined);
 
  constructor(service: Service) {
    super(service);
    this.messageText = null;
    this.additionalMessages = 0;
    this.isInterior = false;
    this.priceOverride = null;
    this.updates = 0;
    this.date = undefined;
  }
 
  reset(): void {
    super.reset();
    this.messageText = null;
    this.additionalMessages = 0;
    this.isInterior = false;
    this.priceOverride = null;
    this.updates = 0;
    this.date = undefined;
  }
 
  toInput(): CampaignServiceInput {
    return {
      serviceId: this.id,
      pieces: this.pieces,
      options: {
        messageText: this.messageText,
        additionalMessages: this.additionalMessages,
        isInterior: this.isInterior,
        priceOverride: this.priceOverride,
        updates: this.updates,
        date: this.date?.toString(),
      },
    };
  }
}
 
export class ServiceEventUI extends BaseServiceUI {
  forMassBroadcast = $state<boolean>(false);
  date = $state<CalendarDate | undefined>(undefined);
 
  constructor(service: Service) {
    super(service);
    this.forMassBroadcast = false;
    this.date = undefined;
  }
 
  reset(): void {
    super.reset();
    this.forMassBroadcast = false;
    this.date = undefined;
  }
 
  toInput(): CampaignServiceInput {
    return {
      serviceId: this.id,
      pieces: this.pieces,
      options: {
        forMassBroadcast: this.forMassBroadcast,
        date: this.date?.toString(),
      },
    };
  }
}
 
class Piece {
  name: string;
 
  constructor(name: string) {
    this.name = name;
  }
}