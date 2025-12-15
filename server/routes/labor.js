import express from 'express';
import { db } from '../database/init.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const labor = await db.labor.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(labor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const labor = await db.labor.findMany({
      where: { type },
      orderBy: { name: 'asc' }
    });
    res.json(labor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, designation, department, contact, daily_rate, type } = req.body;
    const labor = await db.labor.create({
      data: {
        name,
        designation,
        department,
        contact,
        dailyRate: daily_rate,
        type
      }
    });
    res.json(labor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, department, contact, daily_rate, type, status } = req.body;
    const labor = await db.labor.update({
      where: { id },
      data: {
        name,
        designation,
        department,
        contact,
        dailyRate: daily_rate,
        type,
        status
      }
    });
    res.json(labor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.labor.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
