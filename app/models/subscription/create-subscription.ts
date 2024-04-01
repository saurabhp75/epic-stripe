import { type Subscription } from '@prisma/client'
import { prisma } from '#app/utils/db.server.ts'

export async function createSubscription(
	subscription: Omit<Subscription, 'createdAt' | 'updatedAt'>,
) {
	return prisma.subscription.create({
		data: { ...subscription },
	})
}
