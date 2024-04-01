import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { getPlanById } from '#app/models/plan/get-plan'
import { createSubscription } from '#app/models/subscription/create-subscription'
import { getSubscriptionByUserId } from '#app/models/subscription/get-subscription'
import { createStripeSubscription } from '#app/services/stripe/api/create-subscription'
import { PlanId } from '#app/services/stripe/plans'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import { getDefaultCurrency } from '#app/utils/locales'

export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	// get user details from prisma
	const user = await prisma.user.findUniqueOrThrow({
		select: {
			id: true,
			customerId: true,
		},
		where: { id: userId },
	})

	const subscription = await getSubscriptionByUserId(user.id)
	if (subscription?.id) return redirect('/account')
	if (!user.customerId) throw new Error('Unable to find Customer ID.')

	// Get client's currency and Free Plan price ID.
	const currency = getDefaultCurrency(request)
	const freePlan = await getPlanById(PlanId.FREE, { prices: true })
	const freePlanPrice = freePlan?.prices.find(
		price => price.interval === 'year' && price.currency === currency,
	)
	if (!freePlanPrice) throw new Error('Unable to find Free Plan price.')

	// Create Stripe Subscription.
	const newSubscription = await createStripeSubscription(
		user.customerId,
		freePlanPrice.id,
	)
	if (!newSubscription) throw new Error('Unable to create Stripe Subscription.')

	// Store Subscription into database.
	const storedSubscription = await createSubscription({
		id: newSubscription.id,
		userId: user.id,
		planId: String(newSubscription.items.data[0].plan.product),
		priceId: String(newSubscription.items.data[0].price.id),
		interval: String(newSubscription.items.data[0].plan.interval),
		status: newSubscription.status,
		currentPeriodStart: newSubscription.current_period_start,
		currentPeriodEnd: newSubscription.current_period_end,
		cancelAtPeriodEnd: newSubscription.cancel_at_period_end,
	})
	if (!storedSubscription) throw new Error('Unable to create Subscription.')

	return redirect('/account')
}
