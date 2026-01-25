import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { phone, name, meetingDetails } = await req.json()

        // Construct a clean message for SMS/WhatsApp
        const message = `✅ CONGRATULATIONS ${name}! 
Your internship enrollment is CONFIRMED!

📅 Details:
🕒 Date: ${meetingDetails?.date || 'Coming Monday'}
⏰ Time: ${meetingDetails?.time || '10:00 AM'}
🔗 Link: ${meetingDetails?.link || 'TBD'}

- MindMesh Internships`

        let smsSent = false
        const fast2smsKey = Deno.env.get('FAST2SMS_API_KEY')

        if (fast2smsKey) {
            console.log(`Sending SMS to ${phone}...`)
            try {
                const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
                    method: 'POST',
                    headers: {
                        'authorization': fast2smsKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "route": "q",
                        "message": message,
                        "language": "english",
                        "flash": 0,
                        "numbers": phone,
                    })
                })
                const result = await response.json()
                smsSent = result.return || false
                console.log('SMS Result:', result)
            } catch (err) {
                console.error('SMS Error:', err)
            }
        }

        console.log('NOTIFICATION CONTENT:', message)

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Notifications processed',
                sms_status: smsSent ? 'sent' : 'key_missing_or_failed'
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
