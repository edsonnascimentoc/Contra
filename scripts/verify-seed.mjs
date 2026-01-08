import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()
try {
  const users = await p.user.count()
  const projects = await p.project.count()
  const labor = await p.labor.count()
  const materials = await p.material.count()
  const statusBoard = await p.statusBoard.count()
  console.log(JSON.stringify({ users, projects, labor, materials, statusBoard }, null, 2))
} finally {
  await p.$disconnect()
}
