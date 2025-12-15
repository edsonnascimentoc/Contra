import express from 'express';
import { db } from '../database/init.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const materials = await db.material.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const materials = await db.material.findMany({
      where: { category },
      orderBy: { name: 'asc' }
    });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, category, quantity, unit, costPerUnit, supplier, deliveryDate, status } = req.body;
    const totalCost = costPerUnit ? quantity * costPerUnit : null;
    
    const material = await db.material.create({
      data: {
        name,
        category,
        quantity,
        unit,
        costPerUnit,
        totalCost,
        supplier,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        status: status || 'ORDERED'
      }
    });
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, status, costPerUnit } = req.body;
    
    const updateData = {};
    if (quantity !== undefined) updateData.quantity = quantity;
    if (status !== undefined) updateData.status = status;
    if (costPerUnit !== undefined) {
      updateData.costPerUnit = costPerUnit;
      if (quantity !== undefined) {
        updateData.totalCost = quantity * costPerUnit;
      }
    }
    
    const material = await db.material.update({
      where: { id },
      data: updateData
    });
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.material.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
