import { type Plan } from '@prisma/client'
import { prisma } from '#app/utils/db.server.ts'

export async function updatePlanById(id: Plan['id'], plan: Partial<Plan>) {
	return prisma.plan.update({
		where: { id },
		data: { ...plan },
	})
}
