import { NextResponse, NextRequest } from 'next/server'
import Stripe from 'stripe'
import { proPrice } from '@/app/data/index';

const formatAmountForStripe = (amount: number) => {
  return Math.round(amount * 100)
}

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in the environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20', // Use the latest API version
});

export async function POST(req: NextRequest) {
  try {
    const { price } = await req.json()
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${price === proPrice ? 'Pro' : 'Basic'} Subscription`,
            },
            unit_amount: formatAmountForStripe(price),
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get(
        'Referer',
      )}result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get(
        'Referer',
      )}result?session_id={CHECKOUT_SESSION_ID}`,
    }
    
    const checkoutSession = await stripe.checkout.sessions.create(params)
    
    return NextResponse.json(checkoutSession, {
      status: 200,
    })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: { message: error.message } }, {
      status: 500,
    })
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const session_id = searchParams.get('session_id')

  try {
    if (!session_id) {
      throw new Error('Session ID is required')
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)

    return NextResponse.json(checkoutSession)
  } catch (error: any) {
    console.error('Error retrieving checkout session:', error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}