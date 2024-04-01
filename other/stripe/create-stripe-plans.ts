import { getAllPlans } from '#app/models/plan/get-plan'
import { configureStripeCustomerPortal } from '#app/services/stripe/api/configure-customer-portal'
import { createStripePrice } from '#app/services/stripe/api/create-price'
import { createStripeProduct } from '#app/services/stripe/api/create-product'
import { PRICING_PLANS } from '#app/services/stripe/plans'
import { prisma } from '#app/utils/db.server'

export async function createStripePlans() {
	const plans = await getAllPlans()

	if (plans.length > 0) {
		console.log('🎉 Plans has already been seeded.')
		return true
	}

	const seedProducts = Object.values(PRICING_PLANS).map(
		async ({ id, name, description, features, limits, prices }) => {
			// Format prices to match Stripe's API.
			const pricesByInterval = Object.entries(prices).flatMap(
				([interval, price]) => {
					return Object.entries(price).map(([currency, amount]) => ({
						interval,
						currency,
						amount,
					}))
				},
			)

			try {
				// Create Stripe product.
				await createStripeProduct({
					id,
					name,
					description: description || undefined,
				})
			} catch (e: any) {
				console.log(`Error occured ${e.message}`)
			}

			// Create Stripe price for the current product.
			try {
				const stripePrices = await Promise.all(
					pricesByInterval.map(price => {
						return createStripePrice(id, price)
					}),
				)

				// Store product/plan into database.
				await prisma.plan.create({
					data: {
						id,
						name,
						description,
						limits: {
							create: {
								maxItems: limits.maxItems,
							},
						},
						prices: {
							create: stripePrices.map(price => ({
								id: price.id,
								amount: price.unit_amount ?? 0,
								currency: price.currency,
								interval: price.recurring?.interval ?? 'month',
							})),
						},
					},
				})

				// Return product ID and prices.
				// Used to configure the Customer Portal.
				return {
					product: id,
					prices: stripePrices.map(price => price.id),
				}
			} catch (error) {
				throw new Error('Failed to create Stripe prices')
			}
		},
	)

	try {
		// Create Stripe products and stores them into database.
		const seededProducts = await Promise.all(seedProducts)
		console.log(`📦 Stripe Products has been successfully created.`)

		// Configure Customer Portal.
		await configureStripeCustomerPortal(seededProducts)
		console.log(`👒 Stripe Customer Portal has been successfully configured.`)
		console.log(
			'🎉 Visit: https://dashboard.stripe.com/test/products to see your products.',
		)
	} catch (error) {
		throw new Error('Failed to create Stripe product/customer-portal')
	}
}

await createStripePlans()
