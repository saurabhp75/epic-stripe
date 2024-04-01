import { type Subscription } from '@prisma/client'
import { prisma } from '#app/utils/db.server.ts'

export async function deleteSubscriptionById(id: Subscription['id']) {
	return prisma.subscription.delete({
		where: { id },
	})
}
