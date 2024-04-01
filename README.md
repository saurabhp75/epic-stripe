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
> entities on Prisma platform.

- Run dev server (`npm run dev`) and go to `/account` page.

## Further docs

- [Stripe-stack](https://github.com/dev-xo/stripe-stack)
- [Epic Stack](https://github.com/dev-xo/stripe-stack)

## Support

If you find this template useful, support it with a
[Star ⭐](https://github.com/saurabhp75/epic-stripe)<br /> It helps the
repository grow and gives me motivation to keep working on it. Thank you!
