import { describe, expect, it } from 'vitest';
import { columns, type TableBill } from './columns';

const bill: TableBill = {
  billId: 7,
  title: 'Comprobante',
  description: 'Pago mensual',
  state: 'EXPENSE',
  amount: 1200.5,
  date: '2026-06-01',
};

const createRow = (original: TableBill = bill) => ({
  original,
  getValue: (key: keyof TableBill) => original[key],
});

const getColumn = (accessorKey: string) =>
  columns.find(
    (column) => 'accessorKey' in column && column.accessorKey === accessorKey,
  );

describe('expenses-incomes columns', () => {
  it('defines basic text columns', () => {
    expect(getColumn('title')).toBeDefined();
    expect(getColumn('description')).toBeDefined();
    expect(getColumn('date')).toBeDefined();
  });

  it('translates bill state to Spanish labels', () => {
    expect(getColumn('state')?.cell?.({ row: createRow() } as never)).toBe(
      'Gasto',
    );
    expect(
      getColumn('state')?.cell?.({
        row: createRow({
          ...bill,
          state: 'INCOME',
        }),
      } as never),
    ).toBe('Ingreso');
  });

  it('formats the amount as Uruguayan pesos', () => {
    expect(getColumn('amount')?.cell?.({ row: createRow() } as never)).toBe(
      new Intl.NumberFormat('es-UY', {
        style: 'currency',
        currency: 'UYU',
      }).format(1200.5),
    );
  });

  it('includes an actions column', () => {
    expect(
      columns.some((column) => 'id' in column && column.id === 'actions'),
    ).toBe(true);
  });
});
