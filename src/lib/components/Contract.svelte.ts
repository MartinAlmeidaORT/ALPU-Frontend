import {
  ServiceType,
  type CampaignInput,
  type Interval,
  type Service,
} from '$lib/graphql/schema';
import type { CampaignServiceInput } from '$lib/graphql/types/graphql';
import type { CalendarDate } from '@internationalized/date';

export class Contract {
  contractSerial: string | null;
  clientId: number;
  broadcasterId: number;
  campaignName: string | null;
  countryCode: string | null;
  services: BaseServiceUI[];

  constructor() {
    this.contractSerial = null;
    this.clientId = 0;
    this.broadcasterId = 0;
    this.campaignName = null;
    this.countryCode = null;
    this.services = [];
  }

  addOrUpdateService(service: BaseServiceUI): void {
    this.services = this.services.filter((s) => s.id !== service.id);
    this.services.push(service);
  }

  removeService(index: number): void {
    this.services = this.services.filter((_, i) => i !== index);
  }

  removeAllServices(): void {
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
  pieces: Piece[];
  type: string | null;

  constructor(service: Service) {
    this.id = service.serviceId;
    this.pieces = [];
    this.type = service.type;
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
  period: Interval | null;
  isInterior: boolean;
  isInternalUse: boolean;

  constructor(service: Service) {
    super(service);
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
  isNonCommercialContent: boolean;
  isInternetBroadcast: boolean;
  narrativeMinutes: number;
  isPriceSuggested: number | null;
  isExtraRoles: number | null;
  isLipSync: boolean;
  date: CalendarDate | null;

  constructor(service: Service) {
    super(service);
    this.isNonCommercialContent = false;
    this.isInternetBroadcast = false;
    this.narrativeMinutes = 0;
    this.isPriceSuggested = null;
    this.isExtraRoles = null;
    this.isLipSync = false;
    this.date = null;
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
        date: this.date,
      },
    };
  }
}

export class ServiceIvrUI extends BaseServiceUI {
  messageText: string | null;
  additionalMessages: number;
  isInterior: boolean;
  priceOverride: number | null;
  updates: number | null;
  date: CalendarDate | null;

  constructor(service: Service) {
    super(service);
    this.messageText = null;
    this.additionalMessages = 0;
    this.isInterior = false;
    this.priceOverride = null;
    this.updates = null;
    this.date = null;
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
        date: this.date,
      },
    };
  }
}

export class ServiceEventUI extends BaseServiceUI {
  forMassBroadcast: boolean;
  date: CalendarDate | null;

  constructor(service: Service) {
    super(service);
    this.forMassBroadcast = false;
    this.date = null;
  }

  toInput(): CampaignServiceInput {
    return {
      serviceId: this.id,
      pieces: this.pieces,
      options: {
        forMassBroadcast: this.forMassBroadcast,
        date: this.date,
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
