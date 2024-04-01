import { type Plan } from '@prisma/client'
import { prisma } from '#app/utils/db.server.ts'

export async function createPlan(plan: Omit<Plan, 'createdAt' | 'updatedAt'>) {
	return prisma.plan.create({
		data: { ...plan },
	})
}
