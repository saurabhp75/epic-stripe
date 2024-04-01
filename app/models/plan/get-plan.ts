import { type Prisma, type Plan } from '@prisma/client'
import { prisma } from '#app/utils/db.server.ts'

export async function getPlanById(
	id: Plan['id'],
	include?: Prisma.PlanInclude,
) {
	return prisma.plan.findUnique({
		where: { id },
		include: {
			...include,
			prices: include?.prices || false,
		},
	})
}

export async function getAllPlans(include?: Prisma.PlanInclude) {
	return prisma.plan.findMany({
		include: {
			...include,
			prices: include?.prices || false,
		},
	})
}
