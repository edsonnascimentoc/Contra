import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchAPI } from './api';

const originalFetch = global.fetch;

describe('fetchAPI', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch as any;
  });

  it('retorna dados JSON quando a resposta é ok', async () => {
    const mockData = { ok: true, items: [1, 2, 3] };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => mockData
    });

    const data = await fetchAPI('/status');
    expect(data).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalled();
  });

  it('lança erro quando Content-Type não é JSON', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'text/html' },
      text: async () => '<html>...</html>'
    });

    await expect(fetchAPI('/status')).rejects.toThrow(/resposta inválida/i);
  });

  it('lança erro com status quando resposta não é ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      headers: { get: () => 'application/json' },
      text: async () => 'Not Found'
    });

    await expect(fetchAPI('/status')).rejects.toThrow(/Endpoint não encontrado/i);
  });
});
