import { render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import ChartBarMultiple from './chart-bar-multiple.svelte';

// layerchart: reemplazamos BarChart por un stub que expone la prop `data` ya
// calculada por el componente (top 10 clientes ordenados por contratos pagos).
vi.mock('layerchart', async () => {
  const MockChart = (await import('./mocks/MockChart.svelte')).default;
  return { BarChart: MockChart };
});

// Contenedores de UI: solo necesitamos que rendericen sus children.
vi.mock('$lib/components/ui/chart/index.js', async () => {
  const Stub = (await import('./mocks/PassthroughStub.svelte')).default;
  return { Container: Stub, Tooltip: Stub };
});

vi.mock('$lib/components/ui/card/index.js', async () => {
  const Stub = (await import('./mocks/PassthroughStub.svelte')).default;
  return {
    Root: Stub,
    Header: Stub,
    Title: Stub,
    Description: Stub,
    Content: Stub,
  };
});

function getChartData() {
  const el = screen.getByTestId('mock-chart');
  return JSON.parse(el.getAttribute('data-chart') ?? '[]') as Array<{
    cliente: string;
    contratos: number;
  }>;
}

describe('ChartBarMultiple', () => {
  it('aplana los clientes de todos los meses en una sola lista', () => {
    render(ChartBarMultiple, {
      clientsByPaidMonths: [
        {
          month: '01-2026',
          clients: [{ firstName: 'Ana', lastName: 'Pérez', paidContracts: 3 }],
        },
        {
          month: '02-2026',
          clients: [
            { firstName: 'Bruno', lastName: 'Gómez', paidContracts: 5 },
          ],
        },
      ],
    });

    const data = getChartData();
    expect(data).toHaveLength(2);
    expect(data.map((d) => d.cliente)).toEqual(
      expect.arrayContaining(['Ana Pérez', 'Bruno Gómez']),
    );
  });

  it('ordena los clientes de mayor a menor cantidad de contratos', () => {
    render(ChartBarMultiple, {
      clientsByPaidMonths: [
        {
          month: '01-2026',
          clients: [
            { firstName: 'Ana', lastName: 'Pérez', paidContracts: 3 },
            { firstName: 'Bruno', lastName: 'Gómez', paidContracts: 8 },
            { firstName: 'Carla', lastName: 'Díaz', paidContracts: 1 },
          ],
        },
      ],
    });

    const data = getChartData();
    expect(data.map((d) => d.contratos)).toEqual([8, 3, 1]);
    expect(data[0].cliente).toBe('Bruno Gómez');
  });

  it('limita el resultado a un máximo de 10 clientes', () => {
    const clients = Array.from({ length: 15 }, (_, i) => ({
      firstName: `Cliente${i}`,
      lastName: 'Test',
      paidContracts: i,
    }));

    render(ChartBarMultiple, {
      clientsByPaidMonths: [{ month: '01-2026', clients }],
    });

    const data = getChartData();
    expect(data).toHaveLength(10);
    // Deben ser los 10 con mayor cantidad de contratos (14 .. 5)
    expect(data.map((d) => d.contratos)).toEqual([
      14, 13, 12, 11, 10, 9, 8, 7, 6, 5,
    ]);
  });

  it('maneja una lista vacía sin romper', () => {
    const { unmount } = render(ChartBarMultiple, { clientsByPaidMonths: [] });
    expect(getChartData()).toEqual([]);
    unmount();
  });

  it('maneja clientsByPaidMonths undefined sin romper', () => {
    // @ts-expect-error - probamos robustez ante undefined
    render(ChartBarMultiple, { clientsByPaidMonths: undefined });
    expect(getChartData()).toEqual([]);
  });

  it('maneja grupos sin la propiedad clients', () => {
    render(ChartBarMultiple, {
      // @ts-expect-error - simulamos un grupo mal formado
      clientsByPaidMonths: [{ month: '01-2026' }],
    });
    expect(getChartData()).toEqual([]);
  });
});
