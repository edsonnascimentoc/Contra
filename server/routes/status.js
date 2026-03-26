import express from 'express';
import { db } from '../database/init.js';

const router = express.Router();

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
    const { projectName, phase, status, progress, startDate, endDate } = req.body;
    
    if (!projectName || !phase) {
      return res.status(400).json({ error: 'Nome do projeto e fase são obrigatórios' });
    }

    const start = startDate ? new Date(String(startDate)) : null;
    const end = endDate ? new Date(String(endDate)) : null;

    const item = await db.statusBoard.upsert({
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
    const { projectName, phase, progress, status, startDate, endDate } = req.body;

    const updateData = {};
    if (projectName !== undefined) updateData.projectName = projectName;
    if (phase !== undefined) updateData.phase = phase;
    if (progress !== undefined) updateData.progress = Number(progress);
    if (status !== undefined) updateData.status = status;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(String(startDate)) : null;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(String(endDate)) : null;

    const item = await db.statusBoard.update({
      where: { id },
      data: updateData
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
