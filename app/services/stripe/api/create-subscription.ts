import { type User, type Price } from '@prisma/client'
import { type Stripe } from 'stripe'
import { stripe } from '#app/services/stripe/config.server'

export async function createStripeSubscription(
	customerId: User['customerId'],
	price: Price['id'],
	params?: Stripe.SubscriptionCreateParams,
) {
	if (!customerId || !price)
		throw new Error(
			'Missing required parameters to create Stripe Subscription.',
		)

	return stripe.subscriptions.create({
		...params,
		customer: customerId,
		items: [{ price }],
	})
}
