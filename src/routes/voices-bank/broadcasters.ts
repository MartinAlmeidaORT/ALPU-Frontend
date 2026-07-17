/*import { type Broadcaster, type BroadcasterFilters, type SelectOption } from '$lib/types/broadcaster.js';


 * Reemplazar estas funciones por las llamadas reales (GraphQL/urql, REST, etc.)
 * a tu API existente. Se dejan como stubs para no asumir el esquema de datos.
 

export async function fetchBroadcasters(filters: BroadcasterFilters): Promise<Broadcaster[]> {
	// TODO: reemplazar por la query real, por ejemplo con el cliente urql del proyecto.
	const params = new URLSearchParams();
	if (filters.firstName) params.set('firstName', filters.firstName);
	if (filters.lastName) params.set('lastName', filters.lastName);
	if (filters.skill && filters.skill !== '') params.set('skill', filters.skill);
	if (filters.language && filters.language !== '')
		params.set('language', filters.language);

	const response = await fetch(`/api/broadcasters?${params.toString()}`);
	if (!response.ok) {
		throw new Error('No se pudieron cargar los locutores.');
	}
	return response.json();
}

export async function fetchSkillOptions(): Promise<SelectOption[]> {
	const response = await fetch('/api/broadcasters/skills');
	if (!response.ok) {
		throw new Error('No se pudieron cargar las aptitudes.');
	}
	return response.json();
}

export async function fetchLanguageOptions(): Promise<SelectOption[]> {
	const response = await fetch('/api/broadcasters/languages');
	if (!response.ok) {
		throw new Error('No se pudieron cargar los idiomas.');
	}
	return response.json();
}
*/
