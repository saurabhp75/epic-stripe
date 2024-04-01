import { type Plan, type Price } from '@prisma/client'
import { type Stripe } from 'stripe'
import { stripe } from '#app/services/stripe/config.server'
import { type Interval } from '#app/services/stripe/plans'

export async function createStripePrice(
	id: Plan['id'],
	price: Partial<Price>,
	params?: Stripe.PriceCreateParams,
) {
	if (!id || !price)
		throw new Error('Missing required parameters to create Stripe Price.')

	return stripe.prices.create({
		...params,
		product: id,
		currency: price.currency ?? 'usd',
		unit_amount: price.amount ?? 0,
		tax_behavior: 'inclusive',
		recurring: {
			interval: (price.interval as Interval) ?? 'month',
		},
	})
}
