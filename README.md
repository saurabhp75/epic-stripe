# Stripe with Epic Stack

## Introduction

- This project integrates Stripe payments with
  [Epic Stack](https://github.com/epicweb-dev/epic-stack) and is heavily
  inspired by [stripe-stack](https://github.com/dev-xo/stripe-stack)

## How to run locally

- Clone the repo. In order to use Stripe Subscriptions and seed our database,
  we'll require to get the secret keys from our Stripe Dashboard.

- Create a new [Stripe Account](https://dashboard.stripe.com/login).
- Visit [API Keys](https://dashboard.stripe.com/test/apikeys) section and copy
  the `Publishable` and `Secret` keys.
- Paste each one of them into your `.env` file as `STRIPE_PUBLIC_KEY` and
  `STRIPE_SECRET_KEY` respectively.
- Install the [Stripe CLI.](https://stripe.com/docs/stripe-cli) Once installed
  run the following command in your console:

```sh
stripe listen --forward-to localhost:3000/api/webhook
```

This should give you a Webhook Secret Key. Copy and paste it into your `.env`
file as `DEV_STRIPE_WEBHOOK_ENDPOINT`.

> [!IMPORTANT] This command should be running in your console while developing
> and running the `create-stripe-plan.ts` script.

- Run the seed script to populate Epic stack related data in the db.

```sh
npx prisma db seed
```

- Run the following script to programatically create Stripe Plans and populate
  the db.

```sh
npx tsx ./other/stripe/create-stripe-plans.ts
```

> **Warning** Run the above script only once as it creates subscriptions related
> entities on Stripe platform.

- Run dev server (`npm run dev`) and go to `/account` page.

## Decisions and the reasoning behind application architecture

- This example implements a common SaaS subscription use case with monthly and
  yearly pricing. Each subscription variant can optionally be configured with a
  limit on number of units user can consume.
- User subscription state is stored in the application db, so as not to fetch
  from Stripe when needed. The state will be kept in sync with Stripe using a
  webhook. See this
  [article](https://dev.to/stripe/enable-your-saas-users-to-access-paid-features-with-webhooks-4n8f)
  for details.

- There are endpoints under `/services/stripe/api` and
  `/resources/stripe/create-*` within the application to manage Stripe calls.
  Communication with Stripe end point is managed by stacking redirects, if you
  need clean browser history, these endpoints can be converted to stacked
  asynchronous calls but in that case youy need to handle edge cases like when
  user cancels the page load while waiting for stacked async calls.

## Further docs

- [Stripe-stack](https://github.com/dev-xo/stripe-stack)
- [Epic Stack](https://github.com/dev-xo/stripe-stack)

## Support

If you find this template useful, support it with a
[Star ⭐](https://github.com/saurabhp75/epic-stripe)<br /> It helps the
repository grow and gives me motivation to keep working on it. Thank you!
