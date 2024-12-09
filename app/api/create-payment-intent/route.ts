'use server';
import prismadb from '@/lib/prismadb';
import { auth, currentUser, getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-10-28.acacia',
});
export async function GET(req: Request) {
  const user = await currentUser();
  console.log("Headers:", req.headers);
  console.log('user', user);
  return NextResponse.json({ user });
}
export async function POST(req: Request) {
  console.log("Headers:", req.headers);
  const user = await currentUser();
  console.log('user', user);
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
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );
    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        {
          amount: booking.totalPrice,
        }
      );

      const res = await prismadb.booking.update({
        where: { paymentIntentId: payment_intent_id, userId: user.id },
        data: bookingData,
      });

      if (!res) {
        return NextResponse.error();
      }
      console.log(updated_intent);
      return NextResponse.json({ paymentIntent: updated_intent });
    }
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
    console.log(paymentIntent);
    return NextResponse.json(paymentIntent);
  }

  return new NextResponse('Internal Server Error', { status: 500 });
}
