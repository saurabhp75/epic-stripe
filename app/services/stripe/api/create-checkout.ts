import { type User, type Price } from '@prisma/client'
import { type Stripe } from 'stripe'

import { stripe } from '#app/services/stripe/config.server'
import { getDomainUrl } from '#app/utils/misc'

export async function createStripeCheckoutSession(
	customerId: User['customerId'],
	priceId: Price['id'],
	request: Request,
	params?: Stripe.Checkout.SessionCreateParams,
) {
	const HOST_URL = getDomainUrl(request)
	if (!customerId || !priceId)
		throw new Error(
			'Missing required parameters to create Stripe Checkout Session.',
		)

	const session = await stripe.checkout.sessions.create({
		customer: customerId,
		line_items: [{ price: priceId, quantity: 1 }],
		mode: 'subscription',
		payment_method_types: ['card'],
		success_url: `${HOST_URL}/checkout`,
		cancel_url: `${HOST_URL}/plans`,
		...params,
	})
	if (!session?.url)
		throw new Error('Unable to create Stripe Checkout Session.')

	return session.url
}
