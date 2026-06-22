import { describe, expect, it } from 'vitest';
import { columns, type TableContract } from './columns';

const contract: TableContract = {
  contractId: 12,
  broadcaster: {
    firstName: 'Ada',
    lastName: 'Radio',
  },
  client: {
    firstName: 'Grace',
    lastName: 'Client',
    agency: {
      name: 'Agency One',
    },
  },
  state: 'ACTIVE',
  date: '2026-06-01T15:30:00.000Z',
  dueDate: '2026-07-01T15:30:00.000Z',
};

const createRow = (original: TableContract = contract) => ({ original });

const getColumn = (accessorKey: string) =>
  columns.find((column) => 'accessorKey' in column && column.accessorKey === accessorKey);

describe('contracts columns', () => {
  it('formats contract id with a leading hash', () => {
    const column = getColumn('contractId');

    expect(column?.cell?.({ row: createRow() } as never)).toBe('#12');
  });

  it('formats broadcaster and client full names', () => {
    expect(getColumn('broadcaster')?.cell?.({ row: createRow() } as never)).toBe(
      'Ada Radio',
    );
    expect(getColumn('client')?.cell?.({ row: createRow() } as never)).toBe(
      'Grace Client',
    );
  });

  it('formats agency with N/A fallback', () => {
    expect(getColumn('agency')?.cell?.({ row: createRow() } as never)).toBe(
      'Agency One',
    );
    expect(
      getColumn('agency')?.cell?.({
        row: createRow({
          ...contract,
          client: {
            ...contract.client,
            agency: null,
          },
        }),
      } as never),
    ).toBe('N/A');
  });

  it('translates known states and preserves unknown states', () => {
    expect(getColumn('state')?.cell?.({ row: createRow() } as never)).toBe('Activo');
    expect(
      getColumn('state')?.cell?.({
        row: createRow({
          ...contract,
          state: 'ARCHIVED',
        }),
      } as never),
    ).toBe('ARCHIVED');
  });

  it('formats date and due date as ISO calendar dates', () => {
    expect(getColumn('date')?.cell?.({ row: createRow() } as never)).toBe(
      '2026-06-01',
    );
    expect(getColumn('dueDate')?.cell?.({ row: createRow() } as never)).toBe(
      '2026-07-01',
    );
  });

  it('filters by broadcaster or client full name case-insensitively', () => {
    const broadcasterColumn = getColumn('broadcaster');
    const row = createRow();

    expect(broadcasterColumn?.filterFn?.(row as never, 'broadcaster', 'ada')).toBe(
      true,
    );
    expect(
      broadcasterColumn?.filterFn?.(row as never, 'broadcaster', 'grace client'),
    ).toBe(true);
    expect(
      broadcasterColumn?.filterFn?.(row as never, 'broadcaster', 'missing'),
    ).toBe(false);
  });

  it('does not filter rows through the client column', () => {
    expect(getColumn('client')?.filterFn?.(createRow() as never, 'client', 'x')).toBe(
      true,
    );
  });
});
