import { type User } from '@prisma/client'
import { prisma } from '#app/utils/db.server'

export async function updateUserById(id: User['id'], user: Partial<User>) {
	return prisma.user.update({
		where: { id },
		data: { ...user },
	})
}
