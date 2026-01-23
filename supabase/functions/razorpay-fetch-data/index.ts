// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

declare const Deno: any;

const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID');
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET');

serve(async (req: any) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    }

    try {
        const { type, count = 10, skip = 0 } = await req.json();

        if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
            throw new Error('Razorpay keys not configured in Edge Function environment');
        }

        const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
        let endpoint = '';

        if (type === 'payments') {
            endpoint = `https://api.razorpay.com/v1/payments?count=${count}&skip=${skip}`;
        } else if (type === 'settlements') {
            endpoint = `https://api.razorpay.com/v1/settlements?count=${count}&skip=${skip}`;
        } else {
            return new Response(JSON.stringify({ error: 'Invalid type requested' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            });
        }

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Razorpay API error: ${errorText}`);
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('Error fetching Razorpay data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';
        return new Response(
            JSON.stringify({ error: errorMessage }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
});
