import { render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import ChartPieLegend from './chart-pie-legend.svelte';

vi.mock('layerchart', async () => {
  const MockChart = (await import('./mocks/MockChart.svelte')).default;
  return { PieChart: MockChart };
});

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
    color: string;
  }>;
}

function broadcaster(firstName: string, lastName: string, contracts: number) {
  return { user: { firstName, lastName }, contracts };
}

describe('ChartPieLegend', () => {
  it('ordena los locutores de mayor a menor cantidad de contratos', () => {
    render(ChartPieLegend, {
      broadcasters: [
        broadcaster('Ana', 'Pérez', 3),
        broadcaster('Bruno', 'Gómez', 9),
        broadcaster('Carla', 'Díaz', 5),
      ],
    });

    const data = getChartData();
    expect(data.map((d) => d.contratos)).toEqual([9, 5, 3]);
    expect(data[0].cliente).toBe('Bruno Gómez');
  });

  it('limita el resultado a un máximo de 5 locutores', () => {
    const broadcasters = Array.from({ length: 8 }, (_, i) =>
      broadcaster(`Locutor${i}`, 'Test', i),
    );

    render(ChartPieLegend, { broadcasters });

    const data = getChartData();
    expect(data).toHaveLength(5);
    expect(data.map((d) => d.contratos)).toEqual([7, 6, 5, 4, 3]);
  });

  it('asigna un color secuencial var(--chart-N) a cada segmento', () => {
    render(ChartPieLegend, {
      broadcasters: [
        broadcaster('Ana', 'Pérez', 1),
        broadcaster('Bruno', 'Gómez', 2),
        broadcaster('Carla', 'Díaz', 3),
      ],
    });

    const data = getChartData();
    expect(data.map((d) => d.color)).toEqual([
      'var(--chart-1)',
      'var(--chart-2)',
      'var(--chart-3)',
    ]);
  });

  it('renderiza la leyenda manual con nombre y cantidad de contratos', () => {
    render(ChartPieLegend, {
      broadcasters: [broadcaster('Ana', 'Pérez', 4)],
    });

    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('(4)')).toBeInTheDocument();
  });

  it('maneja una lista vacía sin romper', () => {
    render(ChartPieLegend, { broadcasters: [] });
    expect(getChartData()).toEqual([]);
  });
});
