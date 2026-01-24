interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: {
        color?: string;
    };
    modal?: {
        ondismiss?: () => void;
    };
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayInstance {
    open: () => void;
    on: (event: string, handler: () => void) => void;
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

// Load Razorpay script
export const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

// Create Razorpay order (Simulation for Demo)
export const createRazorpayOrder = async (
    amount: number,
    _receipt: string
): Promise<{ id: string; amount: number; currency: string }> => {
    // In a real app, this calls your backend.
    // For this demo, we'll return a mock order to allow the UI to proceed.
    // Note: Without a real order_id, payment verification might fail on backend,
    // but the modal will open and transaction will go through on Razorpay.

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: '', // Empty ID tells our checkout to skip sending order_id
                amount: amount * 100,
                currency: 'INR'
            });
        }, 1000);
    });
};

// Open Razorpay checkout
export const openRazorpayCheckout = (
    order: { id: string; amount: number },
    prefillData: { name: string; email?: string; phone: string },
    onSuccess: (response: RazorpayResponse) => void,
    onDismiss: () => void
): void => {
    const options: any = {
        key: (() => {
            const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
            console.log('Razorpay Key Debug:', key ? `Present (${key.toString().substring(0, 5)}...)` : 'Missing');
            if (!key || typeof key !== 'string' || !key.trim()) {
                throw new Error("Razorpay Key ID is missing or invalid. Please check Vercel Environment Variables.");
            }
            return key.trim();
        })(),
        amount: order.amount,
        currency: 'INR',
        name: 'Internship Enrollment',
        description: '15-Day Internship Program',
        handler: onSuccess,
        prefill: {
            name: prefillData.name,
            email: prefillData.email || '',
            contact: prefillData.phone,
        },
        theme: {
            color: '#0EA5E9', // Sky Blue
        },
        modal: {
            ondismiss: onDismiss,
        },
    };

    // Only add order_id if it exists (Real backend mode)
    if (order.id) {
        options.order_id = order.id;
    }

    const razorpay = new window.Razorpay(options);
    razorpay.open();
};

export type { RazorpayResponse, RazorpayOptions };
