import prismadb from '@/lib/prismadb';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-10-28.acacia',
});

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const { booking, payment_intent_id } = body;

  const bookingData = {
    ...booking,
    userName: user.firstName + ' ' + user.lastName,
    userEmail: user.emailAddresses[0].emailAddress,
    userId: user.id,
    currency: 'vnd',
    paymentIntentId: payment_intent_id,
  };

  let foundBooking;

  if (payment_intent_id) {
    foundBooking = await prismadb.booking.findUnique({
      where: {
        paymentIntentId: payment_intent_id,
        userId: user.id,
      },
    });
  }

  if (foundBooking && payment_intent_id) {
    //Update
  } else {
    //Create
    const paymentIntent = await stripe.paymentIntents.create({
      amount: bookingData.totalPrice,
      currency: bookingData.currency,
      automatic_payment_methods: { enabled: true },
    });

    bookingData.paymentIntentId = paymentIntent.id;

    await prismadb.booking.create({
      data: bookingData,
    });

    return NextResponse.json(paymentIntent);
  }

  return new NextResponse('Internal Server Error', { status: 500 });
}
