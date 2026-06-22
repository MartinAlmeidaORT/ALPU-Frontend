import { describe, expect, it } from 'vitest';
import { columns, type TableUser } from './columns';

const user: TableUser = {
  userId: 3,
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  rut: '123456789012',
  userState: 'ENABLED',
  __typename: 'Administrator',
};

const createRow = (original: TableUser = user) => ({ original });

const getColumn = (accessorKey: string) =>
  columns.find((column) => 'accessorKey' in column && column.accessorKey === accessorKey);

describe('user columns', () => {
  it('formats user id with a leading hash', () => {
    expect(getColumn('userId')?.cell?.({ row: createRow() } as never)).toBe('#3');
  });

  it('formats full name, email, and rut', () => {
    expect(getColumn('name')?.cell?.({ row: createRow() } as never)).toBe(
      'Ada Lovelace',
    );
    expect(getColumn('email')?.cell?.({ row: createRow() } as never)).toBe(
      'ada@example.com',
    );
    expect(getColumn('rut')?.cell?.({ row: createRow() } as never)).toBe(
      '123456789012',
    );
  });

  it('translates known user types and preserves unknown types', () => {
    expect(getColumn('__typename')?.cell?.({ row: createRow() } as never)).toBe(
      'Administrador',
    );
    expect(
      getColumn('__typename')?.cell?.({
        row: createRow({
          ...user,
          __typename: 'UnknownType',
        }),
      } as never),
    ).toBe('UnknownType');
  });

  it('translates known user states and preserves unknown states', () => {
    expect(getColumn('userState')?.cell?.({ row: createRow() } as never)).toBe(
      'Habilitado',
    );
    expect(
      getColumn('userState')?.cell?.({
        row: createRow({
          ...user,
          userState: 'PENDING',
        }),
      } as never),
    ).toBe('Pendiente');
    expect(
      getColumn('userState')?.cell?.({
        row: createRow({
          ...user,
          userState: 'ARCHIVED',
        }),
      } as never),
    ).toBe('ARCHIVED');
  });

  it('filters by full name case-insensitively', () => {
    const nameColumn = getColumn('name');
    const row = createRow();

    expect(nameColumn?.filterFn?.(row as never, 'name', 'ada')).toBe(true);
    expect(nameColumn?.filterFn?.(row as never, 'name', 'lovelace')).toBe(true);
    expect(nameColumn?.filterFn?.(row as never, 'name', 'missing')).toBe(false);
  });

  it('includes an actions column', () => {
    expect(columns.some((column) => 'id' in column && column.id === 'actions')).toBe(
      true,
    );
  });
});
