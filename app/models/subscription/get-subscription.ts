import { type User, type Subscription } from '@prisma/client'
import { prisma } from '#app/utils/db.server.ts'

export async function getSubscriptionById(id: Subscription['id']) {
	return prisma.subscription.findUnique({
		where: { id },
	})
}

export async function getSubscriptionByUserId(userId: User['id']) {
	return prisma.subscription.findUnique({
		where: { userId },
	})
}
