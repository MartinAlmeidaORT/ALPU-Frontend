export interface Broadcaster {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  audioUrl: string;
  age?: number;
  gender?: string;
  skills: string[];
  languages: string[];
  yearsOfExperience?: number;
  description?: string;
  country?: string;
  city?: string;
  additionalInfo?: string;
}

export interface BroadcasterFilters {
  firstName?: string;
  lastName?: string;
  /** Array vacío representa "sin filtro" (ahora se permite selección múltiple) */
  skills: string[];
  languages: string[];
}

export interface SelectOption {
  value: string;
  label: string;
}
