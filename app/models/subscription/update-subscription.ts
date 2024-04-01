import { type Subscription } from '@prisma/client'
import { prisma } from '#app/utils/db.server.ts'

export async function updateSubscriptionById(
	id: Subscription['id'],
	subscription: Partial<Subscription>,
) {
	return prisma.subscription.update({
		where: { id },
		data: { ...subscription },
	})
}

export async function updateSubscriptionByUserId(
	userId: Subscription['userId'],
	subscription: Partial<Subscription>,
) {
	return prisma.subscription.update({
		where: { userId },
		data: { ...subscription },
	})
}
