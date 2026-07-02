import { render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ChartAreaInteractive from './chart-area-interactive.svelte';

vi.mock('layerchart', async () => {
  const MockChart = (await import('./mocks/MockChart.svelte')).default;
  const Stub = (await import('./mocks/PassthroughStub.svelte')).default;
  return { AreaChart: MockChart, Area: Stub, ChartClipPath: Stub };
});

vi.mock('$lib/components/ui/chart/index.js', async () => {
  const Stub = (await import('./mocks/PassthroughStub.svelte')).default;
  return { Container: Stub, Tooltip: Stub };
});

vi.mock('$lib/components/ui/chart/chart-container.svelte', async () => {
  const Stub = (await import('./mocks/PassthroughStub.svelte')).default;
  return { default: Stub };
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

vi.mock('$lib/components/ui/select/index.js', async () => {
  const Stub = (await import('./mocks/PassthroughStub.svelte')).default;
  return { Root: Stub, Trigger: Stub, Content: Stub, Item: Stub };
});

function getChartData() {
  const el = screen.getByTestId('mock-chart');
  return JSON.parse(el.getAttribute('data-chart') ?? '[]') as Array<{
    date: string;
    Puntual: number;
    Morosos: number;
  }>;
}

describe('ChartAreaInteractive', () => {
  beforeEach(() => {
    // "Hoy" fijo para que el filtro por rango (3m/6m/1y) sea determinístico.
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fusiona morosos y puntuales por mes (formato MM-YYYY) sumando los contratos', () => {
    render(ChartAreaInteractive, {
      delinquentUsersByMonths: [
        {
          month: '05-2026',
          clients: [{ lateContracts: 2 }, { lateContracts: 1 }],
        },
      ],
      paidContractsByMonths: [
        {
          month: '05-2026',
          clients: [{ paidContracts: 4 }, { paidContracts: 6 }],
        },
      ],
    });

    const data = getChartData();
    expect(data).toHaveLength(1);
    expect(data[0].Morosos).toBe(3);
    expect(data[0].Puntual).toBe(10);
  });

  it('combina meses presentes en un solo dataset aunque solo aparezcan en una de las dos listas', () => {
    render(ChartAreaInteractive, {
      delinquentUsersByMonths: [
        { month: '06-2026', clients: [{ lateContracts: 2 }] },
      ],
      paidContractsByMonths: [
        { month: '05-2026', clients: [{ paidContracts: 5 }] },
      ],
    });

    const data = getChartData();
    expect(data).toHaveLength(2);
    // El mes que falta en una lista se completa con 0
    const may = data.find((d) => new Date(d.date).getUTCMonth() === 4); // mayo = index 4
    const june = data.find((d) => new Date(d.date).getUTCMonth() === 5);
    expect(may?.Morosos).toBe(0);
    expect(may?.Puntual).toBe(5);
    expect(june?.Puntual).toBe(0);
    expect(june?.Morosos).toBe(2);
  });

  it('filtra (no incluye) los meses donde ambos valores son 0', () => {
    render(ChartAreaInteractive, {
      delinquentUsersByMonths: [
        { month: '05-2026', clients: [{ lateContracts: 0 }] },
        { month: '06-2026', clients: [{ lateContracts: 3 }] },
      ],
      paidContractsByMonths: [
        { month: '05-2026', clients: [{ paidContracts: 0 }] },
      ],
    });

    const data = getChartData();
    expect(data).toHaveLength(1);
    expect(new Date(data[0].date).getUTCMonth()).toBe(5); // solo junio
  });

  it('en el rango por defecto (6m) excluye meses anteriores al corte', () => {
    render(ChartAreaInteractive, {
      delinquentUsersByMonths: [],
      paidContractsByMonths: [
        // "hoy" simulado es 2026-07-15, por lo que el corte de 6 meses es ~2026-01-15
        { month: '12-2025', clients: [{ paidContracts: 10 }] }, // fuera de rango
        { month: '03-2026', clients: [{ paidContracts: 7 }] }, // dentro de rango
      ],
    });

    const data = getChartData();
    expect(data).toHaveLength(1);
    expect(data[0].Puntual).toBe(7);
  });

  it('muestra la etiqueta "Últimos 6 meses" seleccionada por defecto', () => {
    render(ChartAreaInteractive, {
      delinquentUsersByMonths: [],
      paidContractsByMonths: [],
    });

    // Nota: el stub de Select.* renderiza siempre todos los Select.Item (no
    // solo el seleccionado), por lo que "Últimos 6 meses" aparece tanto en el
    // trigger como en la lista de opciones. Verificamos puntualmente el
    // trigger por su aria-label.
    expect(screen.getByLabelText('Seleccionar rango')).toHaveTextContent(
      'Últimos 6 meses',
    );
  });

  it('no rompe cuando ambas listas vienen vacías', () => {
    render(ChartAreaInteractive, {
      delinquentUsersByMonths: [],
      paidContractsByMonths: [],
    });

    expect(getChartData()).toEqual([]);
  });
});
