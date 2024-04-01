
import { type User } from '@prisma/client'
import { prisma } from '#app/utils/db.server'

export async function deleteUserById(id: User['id']) {
	return prisma.user.delete({
		where: { id },
	})
}