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

export const ALL_OPTIONS_VALUE = 'all';

export interface BroadcasterFilters {
	firstName: string;
	lastName: string;
	/** `ALL_OPTIONS_VALUE` representa "sin filtro" (Select no admite value="") */
	skill: string;
	language: string;
}

export interface SelectOption {
	value: string;
	label: string;
}
