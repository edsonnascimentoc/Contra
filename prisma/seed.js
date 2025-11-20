// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...\n');

    console.log('👤 Creating users...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const managerPassword = await bcrypt.hash('manager123', 10);
    const supervisorPassword = await bcrypt.hash('supervisor123', 10);
    const workerPassword = await bcrypt.hash('worker123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@nationalgroup.com' },
        update: {},
        create: {
            email: 'admin@nationalgroup.com',
            passwordHash: adminPassword,
            firstName: 'Rajesh',
            lastName: 'Kumar',
            role: 'ADMIN',
            isActive: true,
            phoneNumber: '+91 98765 43210'
        }
    });
    console.log('  ✅ Admin user created:', admin.email);

    const manager = await prisma.user.upsert({
        where: { email: 'manager@nationalgroup.com' },
        update: {},
        create: {
            email: 'manager@nationalgroup.com',
            passwordHash: managerPassword,
            firstName: 'Priya',
            lastName: 'Sharma',
            role: 'MANAGER',
            isActive: true,
            phoneNumber: '+91 98765 43211'
        }
    });
    console.log('  ✅ Manager user created:', manager.email);

    const supervisor = await prisma.user.upsert({
        where: { email: 'supervisor@nationalgroup.com' },
        update: {},
        create: {
            email: 'supervisor@nationalgroup.com',
            passwordHash: supervisorPassword,
            firstName: 'Amit',
            lastName: 'Patel',
            role: 'SUPERVISOR',
            isActive: true,
            phoneNumber: '+91 98765 43212'
        }
    });
    console.log('  ✅ Supervisor user created:', supervisor.email);

    const worker1 = await prisma.user.upsert({
        where: { email: 'worker1@nationalgroup.com' },
        update: {},
        create: {
            email: 'worker1@nationalgroup.com',
            passwordHash: workerPassword,
            firstName: 'Suresh',
            lastName: 'Singh',
            role: 'WORKER',
            isActive: true,
            phoneNumber: '+91 98765 43213'
        }
    });
    console.log('  ✅ Worker 1 created:', worker1.email);

    const worker2 = await prisma.user.upsert({
        where: { email: 'worker2@nationalgroup.com' },
        update: {},
        create: {
            email: 'worker2@nationalgroup.com',
            passwordHash: workerPassword,
            firstName: 'Ramesh',
            lastName: 'Verma',
            role: 'WORKER',
            isActive: true,
            phoneNumber: '+91 98765 43214'
        }
    });
    console.log('  ✅ Worker 2 created:', worker2.email);

    console.log('\n🏗️  Creating projects...');
    const project1 = await prisma.project.upsert({
        where: { id: 'project-tower-a' },
        update: {},
        create: {
            id: 'project-tower-a',
            name: 'National Group Tower A',
            description: 'Luxury residential tower with 25 floors in Mumbai',
            status: 'IN_PROGRESS',
            startDate: new Date('2025-01-15'),
            endDate: new Date('2026-12-31'),
            budget: 50000000,
            location: 'Andheri West, Mumbai, Maharashtra',
            clientName: 'Mumbai Real Estate Ltd',
            clientContact: '+91 22 1234 5678',
            createdById: admin.id
        }
    });
    console.log('  ✅ Project created:', project1.name);

    const project2 = await prisma.project.upsert({
        where: { id: 'project-tower-b' },
        update: {},
        create: {
            id: 'project-tower-b',
            name: 'National Group Tower B',
            description: 'Commercial complex with retail and office spaces',
            status: 'PLANNING',
            startDate: new Date('2025-06-01'),
            endDate: new Date('2027-05-31'),
            budget: 75000000,
            location: 'Bandra East, Mumbai, Maharashtra',
            clientName: 'Commercial Ventures Pvt Ltd',
            clientContact: '+91 22 8765 4321',
            createdById: admin.id
        }
    });
    console.log('  ✅ Project created:', project2.name);

    const project3 = await prisma.project.upsert({
        where: { id: 'project-villa-complex' },
        update: {},
        create: {
            id: 'project-villa-complex',
            name: 'Luxury Villa Complex',
            description: 'Gated community with 50 luxury villas',
            status: 'IN_PROGRESS',
            startDate: new Date('2024-09-01'),
            endDate: new Date('2026-08-31'),
            budget: 100000000,
            location: 'Lonavala, Maharashtra',
            clientName: 'Premium Homes India',
            clientContact: '+91 20 9876 5432',
            createdById: manager.id
        }
    });
    console.log('  ✅ Project created:', project3.name);

    console.log('\n👥 Adding project members...');
    await prisma.projectMember.upsert({
        where: { 
            projectId_userId: {
                projectId: project1.id,
                userId: manager.id
            }
        },
        update: {},
        create: {
            projectId: project1.id,
            userId: manager.id,
            role: 'project_manager'
        }
    });

    await prisma.projectMember.upsert({
        where: { 
            projectId_userId: {
                projectId: project1.id,
                userId: supervisor.id
            }
        },
        update: {},
        create: {
            projectId: project1.id,
            userId: supervisor.id,
            role: 'supervisor'
        }
    });

    await prisma.projectMember.upsert({
        where: { 
            projectId_userId: {
                projectId: project1.id,
                userId: worker1.id
            }
        },
        update: {},
        create: {
            projectId: project1.id,
            userId: worker1.id,
            role: 'worker'
        }
    });

    await prisma.projectMember.upsert({
        where: { 
            projectId_userId: {
                projectId: project1.id,
                userId: worker2.id
            }
        },
        update: {},
        create: {
            projectId: project1.id,
            userId: worker2.id,
            role: 'worker'
        }
    });
    console.log('  ✅ Members added to Tower A');

    await prisma.projectMember.upsert({
        where: { 
            projectId_userId: {
                projectId: project2.id,
                userId: manager.id
            }
        },
        update: {},
        create: {
            projectId: project2.id,
            userId: manager.id,
            role: 'project_manager'
        }
    });

    await prisma.projectMember.upsert({
        where: { 
            projectId_userId: {
                projectId: project2.id,
                userId: supervisor.id
            }
        },
        update: {},
        create: {
            projectId: project2.id,
            userId: supervisor.id,
            role: 'supervisor'
        }
    });
    console.log('  ✅ Members added to Tower B');

    console.log('\n📋 Creating tasks...');
    const task1 = await prisma.task.create({
        data: {
            title: 'Foundation Excavation',
            description: 'Complete excavation for foundation work',
            status: 'COMPLETED',
            priority: 'HIGH',
            dueDate: new Date('2025-02-15'),
            estimatedHours: 200,
            actualHours: 180,
            projectId: project1.id,
            createdById: manager.id,
            completedAt: new Date('2025-02-10')
        }
    });
    console.log('  ✅ Task created:', task1.title);

    const task2 = await prisma.task.create({
        data: {
            title: 'Concrete Foundation Pouring',
            description: 'Pour concrete for main foundation structure',
            status: 'IN_PROGRESS',
            priority: 'URGENT',
            dueDate: new Date('2025-03-01'),
            estimatedHours: 150,
            actualHours: 80,
            projectId: project1.id,
            createdById: manager.id
        }
    });
    console.log('  ✅ Task created:', task2.title);

    const task3 = await prisma.task.create({
        data: {
            title: 'Steel Framework Installation',
            description: 'Install steel framework for floors 1-5',
            status: 'TODO',
            priority: 'HIGH',
            dueDate: new Date('2025-04-15'),
            estimatedHours: 300,
            projectId: project1.id,
            createdById: manager.id
        }
    });
    console.log('  ✅ Task created:', task3.title);

    const task4 = await prisma.task.create({
        data: {
            title: 'Site Survey and Planning',
            description: 'Complete site survey and create detailed plans',
            status: 'IN_PROGRESS',
            priority: 'URGENT',
            dueDate: new Date('2025-07-01'),
            estimatedHours: 100,
            actualHours: 45,
            projectId: project2.id,
            createdById: manager.id
        }
    });
    console.log('  ✅ Task created:', task4.title);

    const task5 = await prisma.task.create({
        data: {
            title: 'Villa Foundation - Phase 1',
            description: 'Foundation work for villas 1-10',
            status: 'COMPLETED',
            priority: 'HIGH',
            dueDate: new Date('2024-12-31'),
            estimatedHours: 400,
            actualHours: 420,
            projectId: project3.id,
            createdById: manager.id,
            completedAt: new Date('2024-12-28')
        }
    });
    console.log('  ✅ Task created:', task5.title);

    console.log('\n👷 Assigning tasks to workers...');
    await prisma.taskAssignment.create({
        data: {
            taskId: task2.id,
            userId: worker1.id
        }
    });

    await prisma.taskAssignment.create({
        data: {
            taskId: task2.id,
            userId: worker2.id
        }
    });

    await prisma.taskAssignment.create({
        data: {
            taskId: task4.id,
            userId: supervisor.id
        }
    });
    console.log('  ✅ Tasks assigned to workers');

    console.log('\n💬 Adding comments...');
    await prisma.comment.create({
        data: {
            content: 'Foundation work completed ahead of schedule. Great job team!',
            taskId: task1.id,
            userId: manager.id
        }
    });

    await prisma.comment.create({
        data: {
            content: 'Concrete pouring is progressing well. Weather conditions are favorable.',
            taskId: task2.id,
            userId: supervisor.id
        }
    });

    await prisma.comment.create({
        data: {
            content: 'Need additional equipment for steel installation. Please arrange.',
            taskId: task3.id,
            userId: worker1.id
        }
    });
    console.log('  ✅ Comments added');

    console.log('\n📊 Creating activity logs...');
    await prisma.activityLog.create({
        data: {
            action: 'PROJECT_CREATED',
            entityType: 'project',
            entityId: project1.id,
            userId: admin.id,
            projectId: project1.id,
            changes: {
                name: project1.name,
                status: project1.status
            }
        }
    });

    await prisma.activityLog.create({
        data: {
            action: 'TASK_COMPLETED',
            entityType: 'task',
            entityId: task1.id,
            userId: manager.id,
            projectId: project1.id,
            taskId: task1.id,
            changes: {
                status: 'COMPLETED',
                completedAt: task1.completedAt
            }
        }
    });

    await prisma.activityLog.create({
        data: {
            action: 'TASK_ASSIGNED',
            entityType: 'task',
            entityId: task2.id,
            userId: supervisor.id,
            projectId: project1.id,
            taskId: task2.id,
            changes: {
                assignedTo: [worker1.id, worker2.id]
            }
        }
    });
    console.log('  ✅ Activity logs created');

    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('📝 Summary:');
    console.log('  - 5 users created (1 admin, 1 manager, 1 supervisor, 2 workers)');
    console.log('  - 3 projects created');
    console.log('  - 5 tasks created');
    console.log('  - Task assignments and comments added');
    console.log('  - Activity logs initialized\n');
    console.log('🔐 Login credentials:');
    console.log('  Admin: admin@nationalgroup.com / admin123');
    console.log('  Manager: manager@nationalgroup.com / manager123');
    console.log('  Supervisor: supervisor@nationalgroup.com / supervisor123');
    console.log('  Worker: worker1@nationalgroup.com / worker123\n');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
