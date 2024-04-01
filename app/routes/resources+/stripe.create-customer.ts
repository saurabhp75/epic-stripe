import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { updateUserById } from '#app/models/user/update-user'
import { createStripeCustomer } from '#app/services/stripe/api/create-customer'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'

export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)

	// get user details from prisma
	const user = await prisma.user.findUniqueOrThrow({
		select: {
			id: true,
			customerId: true,
			email: true,
			name: true,
		},
		where: { id: userId },
	})

	if (user.customerId) return redirect('/account')

	// Create Stripe Customer.
	const email = user.email ? user.email : undefined
	const name = user.name ? user.name : undefined

	const customer = await createStripeCustomer({ email, name })
	if (!customer) throw new Error('Unable to create Stripe Customer.')

	// Update user.
	await updateUserById(user.id, { customerId: customer.id })

	return redirect('/account')
}
