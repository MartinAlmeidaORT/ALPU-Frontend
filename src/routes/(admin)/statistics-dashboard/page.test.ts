import { render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Page from './+page.svelte';

const toPromise = vi.fn();
const query = vi.fn(() => ({ toPromise }));
const createUrqlClient = vi.fn(() => ({ query }));

vi.mock('$lib/graphql/client', () => ({
  createUrqlClient: (...args: unknown[]) => createUrqlClient(...args),
}));

vi.mock('$lib/graphql/queries/dashboard', () => ({
  DASHBOARD_QUERY: 'DASHBOARD_QUERY',
}));

// Los tres gráficos hijos se reemplazan por un stub que expone las props
// recibidas, así probamos +page.svelte de forma aislada de su implementación.
vi.mock('./chart-bar-multiple.svelte', async () => {
  const Stub = (await import('./mocks/PropsCapture.svelte')).default;
  return { default: Stub };
});
vi.mock('./chart-pie-legend.svelte', async () => {
  const Stub = (await import('./mocks/PropsCapture.svelte')).default;
  return { default: Stub };
});
vi.mock('./chart-area-interactive.svelte', async () => {
  const Stub = (await import('./mocks/PropsCapture.svelte')).default;
  return { default: Stub };
});

function getCapturedProps(index: number) {
  const els = screen.getAllByTestId('props-capture');
  return JSON.parse(els[index].getAttribute('data-props') ?? '{}');
}

const dashboardResponse = {
  totalIncome: 1000,
  totalExpense: 400,
  topBroadcasterByContracts: [
    { user: { firstName: 'Ana', lastName: 'Pérez' }, contracts: 5 },
  ],
  monthlyDelinquentsGroup: [
    { month: '05-2026', clients: [{ lateContracts: 2 }] },
  ],
  monthlyPaidGroup: [{ month: '05-2026', clients: [{ paidContracts: 3 }] }],
};

describe('+page.svelte (statistics-dashboard)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    query.mockReturnValue({ toPromise });
    createUrqlClient.mockReturnValue({ query });
  });

  it('crea el cliente urql con el token recibido en data', async () => {
    toPromise.mockResolvedValueOnce({ data: { dashboard: dashboardResponse } });

    render(Page, { data: { token: 'my-token' } });

    await waitFor(() =>
      expect(createUrqlClient).toHaveBeenCalledWith('my-token'),
    );
    expect(query).toHaveBeenCalledWith('DASHBOARD_QUERY', {});
  });

  it('muestra la facturación total y calcula la recaudación institucional como 3% del ingreso', async () => {
    toPromise.mockResolvedValueOnce({ data: { dashboard: dashboardResponse } });

    render(Page, { data: { token: 't' } });

    // Regex en vez del string exacto: toLocaleString() depende del locale
    // del entorno de ejecución (separador de miles "," o ".").
    await waitFor(() =>
      expect(screen.getByText(/^\$1[.,]?000$/)).toBeInTheDocument(),
    );
    expect(screen.getByText('$30')).toBeInTheDocument(); // 1000 * 0.03
    expect(screen.getByText('$400')).toBeInTheDocument(); // gastos institucionales
  });

  it('pasa a cada gráfico los datos correspondientes de la respuesta', async () => {
    toPromise.mockResolvedValueOnce({ data: { dashboard: dashboardResponse } });

    render(Page, { data: { token: 't' } });

    await waitFor(() =>
      expect(screen.getAllByTestId('props-capture')).toHaveLength(3),
    );

    const barProps = getCapturedProps(0); // ChartBarMultiple
    const pieProps = getCapturedProps(1); // ChartPieLegend
    const areaProps = getCapturedProps(2); // ChartAreaInteractive

    // Nota: el componente asigna monthlyPaidGroup también a
    // topClientsByPaidContracts, por lo que ambos coinciden con la misma forma
    // de datos (Array<{ month, clients }>).
    expect(barProps.clientsByPaidMonths).toEqual(
      dashboardResponse.monthlyPaidGroup,
    );
    expect(pieProps.broadcasters).toEqual(
      dashboardResponse.topBroadcasterByContracts,
    );
    expect(areaProps.delinquentUsersByMonths).toEqual(
      dashboardResponse.monthlyDelinquentsGroup,
    );
    expect(areaProps.paidContractsByMonths).toEqual(
      dashboardResponse.monthlyPaidGroup,
    );
  });

  it('muestra "$0" por defecto mientras no llegó respuesta de la API', () => {
    toPromise.mockReturnValueOnce(new Promise(() => {})); // nunca resuelve

    render(Page, { data: { token: 't' } });

    const zeroValues = screen.getAllByText('$0');
    expect(zeroValues).toHaveLength(3);
  });

  it('no actualiza el estado si la respuesta no trae dashboard', async () => {
    toPromise.mockResolvedValueOnce({ data: null });

    render(Page, { data: { token: 't' } });

    await waitFor(() => expect(query).toHaveBeenCalled());
    const zeroValues = screen.getAllByText('$0');
    expect(zeroValues).toHaveLength(3);
  });
});
