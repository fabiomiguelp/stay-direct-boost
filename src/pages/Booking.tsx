import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {PaymentSuccess} from "@/components/PaymentSuccess";
import {FloatingWhatsAppButton} from "@/components/FloatingWhatsAppButton";
import {Footer} from "@/components/Footer";

const Booking = () => {
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState<'success' | 'error' | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionIdParam = urlParams.get('session_id');
        const paymentParam = urlParams.get('payment');

        console.log('URL Params:', {
            allParams: Object.fromEntries(urlParams.entries())
        });

        setSessionId(sessionIdParam);

        if (sessionIdParam) {
            // Verify payment with backend
            fetch(`http://localhost:8000/api/verify-payment?session_id=${sessionIdParam}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Verify payment response:', data);
                    if (data.status === 'success' && data.hostex_reservation?.error_code === 200) {
                        setPaymentStatus('success');
                    } else {
                        setPaymentStatus('error');
                    }
                })
                .catch(error => {
                    console.error('Error verifying payment:', error);
                    setPaymentStatus('error');
                });
        } else if (paymentParam === 'success') {
            setPaymentStatus('success');
        } else if (paymentParam === 'canceled') {
            setPaymentStatus('error');
        }

        // Clean up URL
        window.history.replaceState({}, '', '/booking');
    }, []);

    const handleNewBooking = () => {
        navigate('/');
    };

    if (!paymentStatus) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading booking details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <PaymentSuccess
                paymentStatus={paymentStatus}
                totalAmount={0}
                nights={0}
                checkInDate=""
                checkOutDate=""
                onNewBooking={handleNewBooking}
            />
            <FloatingWhatsAppButton/>
            <Footer/>
        </div>
    );
};

export default Booking;
