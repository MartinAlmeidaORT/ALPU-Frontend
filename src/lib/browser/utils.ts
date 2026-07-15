import type { CalendarDate } from '@internationalized/date';
import { toast } from 'svelte-sonner';

export function translateRole(role: string): string {
  switch (role) {
    case 'Supervisor':
      return 'Supervisor';
    case 'Administrator':
      return 'Administrador';
    case 'Accountant':
      return 'Contador';
    case 'Client':
      return 'Cliente';
    case 'Broadcaster':
      return 'Locutor';
    default:
      return role;
  }
}

export function validateDate(calendarDate: CalendarDate | undefined): boolean {
  if (!calendarDate || calendarDate.toString() === '') {
    toast.error('Error al agregar un medio', {
      description: 'Debe seleccionar una fecha',
    });
    return false;
  }
  return true;
}
