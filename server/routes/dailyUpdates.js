import express from 'express';
import { db } from '../database/init.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const updates = await db.dailyUpdate.findMany({
      where,
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    res.json(updates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const updates = await db.dailyUpdate.findMany({
      where,
      select: {
        laborCount: true,
        issues: true
      }
    });

    const totalManpower = updates.reduce((sum, u) => sum + u.laborCount, 0);
    const avgManpower = updates.length > 0 ? totalManpower / updates.length : 0;
    const totalSafetyIncidents = updates.filter(u => u.issues && u.issues.toLowerCase().includes('safety')).length;

    res.json({
      total_updates: updates.length,
      total_manpower: totalManpower,
      avg_manpower: avgManpower,
      total_safety_incidents: totalSafetyIncidents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const updates = await db.dailyUpdate.findMany({
      where: {
        date: new Date(date)
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(updates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      date,
      weather,
      workDone,
      laborCount,
      issues,
      photos,
      createdBy
    } = req.body;

    const update = await db.dailyUpdate.create({
      data: {
        date: new Date(date),
        weather,
        workDone,
        laborCount: parseInt(laborCount),
        issues,
        photos: photos ? JSON.stringify(photos) : null,
        createdBy
      }
    });
    res.json(update);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      weather,
      workDone,
      laborCount,
      issues,
      photos
    } = req.body;

    const updateData = {};
    if (weather !== undefined) updateData.weather = weather;
    if (workDone !== undefined) updateData.workDone = workDone;
    if (laborCount !== undefined) updateData.laborCount = parseInt(laborCount);
    if (issues !== undefined) updateData.issues = issues;
    if (photos !== undefined) updateData.photos = JSON.stringify(photos);

    const update = await db.dailyUpdate.update({
      where: { id },
      data: updateData
    });
    res.json(update);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.dailyUpdate.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
