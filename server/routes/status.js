import express from 'express';
import { db } from '../database/init.js';
import { z } from 'zod';

const router = express.Router();

// T3 — Validação Zod no fluxo padrão
const dateSchema = z.string().refine((val) => {
  const d = new Date(val);
  return !isNaN(d.getTime()) && d.getFullYear() > 2000;
}, { message: 'Data inválida ou com ano incorreto (deve ser > 2000)' });

const projectSchema = z.object({
  projectName: z.string().min(1, 'Nome do projeto é obrigatório'),
  phase: z.string().min(1, 'Fase é obrigatória'),
  status: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  startDate: dateSchema,
  endDate: dateSchema,
  isAdminOverride: z.boolean().optional(),
  overrideReason: z.string().optional(),
}).refine(
  (data) => {
    // Se for override administrativo, podemos pular a validação lógica se necessário, 
    // mas o prompt foca na inversão como bug #6
    return new Date(data.endDate) > new Date(data.startDate);
  },
  { message: 'Data de término deve ser posterior à data de início', path: ['endDate'] }
);

const updateProjectSchema = z.object({
  projectName: z.string().min(1).optional(),
  phase: z.string().min(1).optional(),
  status: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  isAdminOverride: z.boolean().optional(),
  overrideReason: z.string().optional(),
}).refine(
  (data) => {
    // Se ambas as datas forem fornecidas, validar cronologia
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) > new Date(data.startDate);
    }
    return true;
  },
  { message: 'Data de término deve ser posterior à data de início', path: ['endDate'] }
);

router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    /**
     * @type {{
     *   startDate?: {
     *     gte?: Date;
     *     lte?: Date;
     *   }
     * }}
     */
    /**
     * @type {{
     *   startDate?: {
     *     gte?: Date;
     *     lte?: Date;
     *   }
     * }}
     */
    let whereClause = {};
    
    // Aplicar filtro de data se fornecido
    if (startDate || endDate) {
      whereClause = {};
      
      const conditions = [];
      
      if (startDate) {
        conditions.push({
          startDate: { gte: new Date(String(startDate)) }
        });
      }
      
      if (endDate) {
        conditions.push({
          endDate: { lte: new Date(String(endDate)) }
        });
      }

      if (conditions.length > 0) {
        whereClause.AND = conditions;
      }
    }
    
    const statusBoard = await db.statusBoard.findMany({
      where: whereClause,
      distinct: ['projectName', 'phase'],
      orderBy: { createdAt: 'desc' }
    });
    res.json(statusBoard);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: message });
  }
});

router.get('/phases', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let whereClause = {};
    
    // Aplicar filtro de data se fornecido
    if (startDate || endDate) {
      whereClause = {};
      
      const conditions = [];
      
      if (startDate) {
        conditions.push({
          startDate: { gte: new Date(String(startDate)) }
        });
      }
      
      if (endDate) {
        conditions.push({
          endDate: { lte: new Date(String(endDate)) }
        });
      }

      if (conditions.length > 0) {
        whereClause.AND = conditions;
      }
    }
    
    const statusData = await db.statusBoard.findMany({
      where: whereClause,
      distinct: ['projectName', 'phase'],
      select: {
        id: true,
        projectName: true,
        phase: true,
        status: true,
        progress: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(statusData);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching status phases:', message);
    res.status(500).json({
      error: 'Internal Server Error',
      message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    // T3 - Validar com Zod
    const validation = projectSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: validation.error.format() 
      });
    }

    const { projectName, phase, status, progress, startDate, endDate, isAdminOverride, overrideReason } = validation.data;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // T5 — Transação ACID
    const item = await db.$transaction(async (tx) => {
      // Verificar se já existe
      const existing = await tx.statusBoard.findUnique({
        where: { projectName_phase: { projectName, phase } }
      });

      const upserted = await tx.statusBoard.upsert({
        where: { projectName_phase: { projectName, phase } },
        update: {
          status,
          progress: Number(progress) || 0,
          startDate: start,
          endDate: end
        },
        create: {
          projectName,
          phase,
          status,
          progress: Number(progress) || 0,
          startDate: start,
          endDate: end
        }
      });

      // Registrar no histórico
      await tx.dateHistory.create({
        data: {
          statusBoardId: upserted.id,
          previousStart: existing?.startDate,
          previousEnd: existing?.endDate,
          newStart: start,
          newEnd: end,
          changedBy: req.user?.email || 'system',
          isAdminOverride: !!isAdminOverride,
          overrideReason: overrideReason || null
        }
      });

      return upserted;
    });

    res.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error creating/updating status item:', message);
    res.status(500).json({ error: message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // T3 - Validar com Zod
    const validation = updateProjectSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: validation.error.format() 
      });
    }

    const { projectName, phase, progress, status, startDate, endDate, isAdminOverride, overrideReason } = validation.data;

    // T5 — Transação ACID
    const item = await db.$transaction(async (tx) => {
      const existing = await tx.statusBoard.findUnique({ where: { id } });
      if (!existing) throw new Error('Projeto não encontrado');

      const updateData = {};
      if (projectName !== undefined) updateData.projectName = projectName;
      if (phase !== undefined) updateData.phase = phase;
      if (progress !== undefined) updateData.progress = Number(progress);
      if (status !== undefined) updateData.status = status;
      if (startDate !== undefined) updateData.startDate = new Date(startDate);
      if (endDate !== undefined) updateData.endDate = new Date(endDate);

      // Validar cronologia final (existente + novo)
      const finalStart = updateData.startDate || existing.startDate;
      const finalEnd = updateData.endDate || existing.endDate;
      if (finalEnd <= finalStart) {
        throw new Error('A data de término deve ser posterior à data de início');
      }

      const updated = await tx.statusBoard.update({
        where: { id },
        data: updateData
      });

      // Registrar histórico se houver mudança nas datas
      if ((startDate && existing.startDate.getTime() !== updateData.startDate.getTime()) || 
          (endDate && existing.endDate.getTime() !== updateData.endDate.getTime())) {
        await tx.dateHistory.create({
          data: {
            statusBoardId: id,
            previousStart: existing.startDate,
            previousEnd: existing.endDate,
            newStart: finalStart,
            newEnd: finalEnd,
            changedBy: req.user?.email || 'system',
            isAdminOverride: !!isAdminOverride,
            overrideReason: overrideReason || null
          }
        });
      }

      return updated;
    });

    res.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error updating status item:', message);
    res.status(500).json({ error: message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.statusBoard.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: message });
  }
});

export default router;
