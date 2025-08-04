import { createClient } from 'redis';

// Basic email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(request: Request) {
  // Ensure this is a POST request
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!process.env.REDIS_URL) {
    console.error("REDIS_URL environment variable not set.");
    return new Response(JSON.stringify({ message: 'Server configuration error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const email = body.email;

    if (!email || !emailRegex.test(email)) {
      return new Response(JSON.stringify({ message: 'Please provide a valid email.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const redis = createClient({ url: process.env.REDIS_URL });
    await redis.connect();

    // SADD adds the email to a set. If it's already a member, it returns 0.
    const result = await redis.sAdd('newsletter_subscribers', email);
    await redis.quit();

    if (result === 0) {
      return new Response(JSON.stringify({ message: 'You are already subscribed.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Subscription successful.' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('API Error:', error);
    // Handle JSON parsing errors specifically
    if (error instanceof SyntaxError) {
        return new Response(JSON.stringify({ message: 'Invalid request body.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    return new Response(JSON.stringify({ message: 'Could not process subscription.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}