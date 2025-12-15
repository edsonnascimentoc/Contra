import express from 'express';
import { db } from '../database/init.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const statusBoard = await db.statusBoard.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(statusBoard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/phases', async (req, res) => {
  try {
    const statusData = await db.statusBoard.findMany({
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
    console.error('Error fetching status phases:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { project_name, phase, status, progress, start_date, end_date } = req.body;
    
    const statusItem = await db.statusBoard.create({
      data: {
        projectName: project_name,
        phase,
        status,
        progress: progress || 0,
        startDate: start_date ? new Date(start_date) : null,
        endDate: end_date ? new Date(end_date) : null
      }
    });
    res.json(statusItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, status } = req.body;
    
    const updateData = {};
    if (progress !== undefined) updateData.progress = progress;
    if (status !== undefined) updateData.status = status;
    
    const statusItem = await db.statusBoard.update({
      where: { id },
      data: updateData
    });
    res.json(statusItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
});

export default router;