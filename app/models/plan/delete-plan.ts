import { type Plan } from '@prisma/client'
import { prisma } from '#app/utils/db.server.ts'

export async function deletePlanById(id: Plan['id']) {
	return prisma.plan.delete({
		where: { id },
	})
}
