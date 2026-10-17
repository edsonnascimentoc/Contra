import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchAPI } from './api';
import { auth } from './stores/auth.svelte';

const originalFetch = global.fetch;

const withTimeout = async <T>(promise: Promise<T>, milliseconds: number, message: string): Promise<T> => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeout = setTimeout(() => reject(new Error(message)), milliseconds);
      })
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
};

describe('fetchAPI', () => {
  let consoleSpy: any;

  beforeEach(() => {
    vi.resetAllMocks();
    auth.accessToken = 'expired-access-token';
    auth.refreshToken = null;
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    global.fetch = originalFetch as any;
    auth.accessToken = null;
    auth.refreshToken = null;
    consoleSpy.mockRestore();
    vi.restoreAllMocks();
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

  it('compartilha um refresh entre requisições concorrentes e resolve todas', async () => {
    auth.refreshToken = 'refresh-token';
    let releaseRefresh!: () => void;
    let markRefreshStarted!: () => void;
    const refreshStarted = new Promise<void>((resolve) => {
      markRefreshStarted = resolve;
    });
    const refreshGate = new Promise<void>((resolve) => {
      releaseRefresh = resolve;
    });
    let refreshCalls = 0;

    global.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input).endsWith('/auth/refresh')) {
        refreshCalls += 1;
        markRefreshStarted();
        await refreshGate;
        return {
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ data: { accessToken: 'fresh-access-token' } })
        } as unknown as Response;
      }

      const authorization = new Headers(init?.headers).get('Authorization');
      if (authorization !== 'Bearer fresh-access-token') {
        return { ok: false, status: 401, headers: { get: () => 'application/json' } } as unknown as Response;
      }

      return {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ ok: true })
      } as unknown as Response;
    });

    const logout = vi.spyOn(auth, 'logout').mockResolvedValue();
    const requests = Promise.all([fetchAPI('/status'), fetchAPI('/materials')]);
    await withTimeout(refreshStarted, 1500, 'Refresh request was not started');
    releaseRefresh();

    const results = await withTimeout(requests, 1500, 'Concurrent refresh left a request pending');

    expect(results).toEqual([{ ok: true }, { ok: true }]);
    expect(refreshCalls).toBe(1);
    expect(logout).not.toHaveBeenCalled();
  });

  it('rejects every waiting request and logs out once when refresh fails', async () => {
    auth.refreshToken = 'refresh-token';
    let refreshCalls = 0;
    global.fetch = vi.fn(async (input: RequestInfo | URL) => {
      if (String(input).endsWith('/auth/refresh')) {
        refreshCalls += 1;
        return { ok: false, status: 401, headers: { get: () => 'application/json' } } as unknown as Response;
      }

      return { ok: false, status: 401, headers: { get: () => 'application/json' } } as unknown as Response;
    });

    const logout = vi.spyOn(auth, 'logout').mockImplementation(async () => {
      auth.accessToken = null;
      auth.refreshToken = null;
    });
    const requests = Promise.allSettled([fetchAPI('/status'), fetchAPI('/materials')]);
    const results = await withTimeout(requests, 1500, 'Failed refresh left a request pending');

    expect(results).toHaveLength(2);
    expect(results.every((result) => result.status === 'rejected')).toBe(true);
    expect(refreshCalls).toBe(1);
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
