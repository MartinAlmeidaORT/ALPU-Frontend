export function translateRole(role: string): string {
  switch (role) {
    case 'Supervisor':
      return 'Supervisor';
    case 'Administrator':
      return 'Administrador';
    case 'Accountant':
      return 'Contador';
    case 'Client':
      return 'Locutor';
    case 'Broadcaster':
      return 'Locutor';
    default:
      return role;
  }
}
