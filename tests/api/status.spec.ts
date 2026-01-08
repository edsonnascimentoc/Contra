import express from 'express'
import router from '../../server/routes/status.js'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

vi.mock('../../server/database/init.js', () => {
  const store: any[] = [
    { id: '1', projectName: 'A', phase: 'INIT', status: 'PLANNING', progress: 10, createdAt: new Date(), updatedAt: new Date() }
  ]
  return {
    db: {
      statusBoard: {
        findMany: vi.fn(async () => store),
        create: vi.fn(async ({ data }: any) => {
          const item = { id: 'x', ...data, createdAt: new Date(), updatedAt: new Date() }
          store.unshift(item)
          return item
        }),
        update: vi.fn(async ({ where, data }: any) => {
          const idx = store.findIndex((s) => s.id === where.id)
          if (idx >= 0) {
            store[idx] = { ...store[idx], ...data, updatedAt: new Date() }
            return store[idx]
          }
          throw new Error('not found')
        }),
        delete: vi.fn(async ({ where }: any) => {
          const idx = store.findIndex((s) => s.id === where.id)
          if (idx >= 0) {
            store.splice(idx, 1)
            return { success: true }
          }
          throw new Error('not found')
        })
      }
    }
  }
})

describe('Status routes', () => {
  let server: any
  let baseUrl: string

  beforeAll(async () => {
    const app = express()
    app.use(express.json())
    app.use('/api/status', router)
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => resolve())
    })
    const address = server.address()
    baseUrl = `http://127.0.0.1:${address.port}`
  })

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  })

  it('GET /api/status returns list', async () => {
    const res = await fetch(`${baseUrl}/api/status`)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(Array.isArray(json)).toBe(true)
    expect(json[0].projectName).toBeDefined()
  })

  it('POST /api/status creates item', async () => {
    const res = await fetch(`${baseUrl}/api/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_name: 'B',
        phase: 'INIT',
        status: 'IN_PROGRESS',
        progress: 5
      })
    })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.projectName).toBe('B')
    expect(json.progress).toBe(5)
  })

  it('PUT /api/status/:id updates progress', async () => {
    const res = await fetch(`${baseUrl}/api/status/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress: 50 })
    })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.progress).toBe(50)
  })

  it('DELETE /api/status/:id removes item', async () => {
    const res = await fetch(`${baseUrl}/api/status/1`, { method: 'DELETE' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })
})
