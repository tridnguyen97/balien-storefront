import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define validation schemas
const shippingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  country: z.string().min(1, "Country is required")
});

const paymentSchema = z.object({
  cardName: z.string().min(2, "Cardholder name is required"),
  cardNumber: z.string()
    .min(13, "Invalid card number")
    .max(19, "Invalid card number")
    .regex(/^\d+$/, "Card number must contain only digits"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date (MM/YY)"),
  cvv: z.string().regex(/^\d{3,4}$/, "Invalid CVV")
});

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  
  // Initialize react-hook-form for shipping step
  const shippingForm = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      name: '',
      email: '',
      address: '',
      city: '',
      zip: '',
      country: ''
    }
  });
  
  // Initialize react-hook-form for payment step
  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: '',
      cardNumber: '',
      expiry: '',
      cvv: ''
    }
  });
  
  const [shippingData, setShippingData] = useState({});
  const [paymentData, setPaymentData] = useState({});

  const handleShippingSubmit = shippingForm.handleSubmit((data) => {
    setShippingData(data);
    setStep('payment');
  });
  const handlePaymentSubmit = paymentForm.handleSubmit((data) => {
    setPaymentData(data);
    setStep('review');
  });
  const handleCompleteOrder = () => {
    // Complete order
    message.success('Order placed successfully!');
    localStorage.removeItem('brim-cart');
    localStorage.removeItem('cart_id'); // Also clear Medusa cart ID
    navigate('/order-confirmation');
  };

   if (step === 'shipping') {
       return (
         <div className="max-w-2xl mx-auto px-6 md:px-10 py-12">
           <h1 className="font-display italic text-2xl font-light text-foreground mb-6">Shipping Information</h1>
           <form onSubmit={handleShippingSubmit} className="bg-[var(--cotton)] border border-[var(--ink-10)] rounded-lg p-6 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <input
                 type="text"
                 name="name"
                 placeholder="Full Name"
                 className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
                 {...shippingForm.register('name')}
               />
               {shippingForm.formState.errors.name && (
                 <p className="text-red-500 text-sm mt-1">{shippingForm.formState.errors.name.message}</p>
               )}
               <input
                 type="email"
                 name="email"
                 placeholder="Email Address"
                 className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
                 {...shippingForm.register('email')}
               />
               {shippingForm.formState.errors.email && (
                 <p className="text-red-500 text-sm mt-1">{shippingForm.formState.errors.email.message}</p>
               )}
             </div>
             <input
               type="text"
               name="address"
               placeholder="Street Address"
               className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
               {...shippingForm.register('address')}
               />
               {shippingForm.formState.errors.address && (
                 <p className="text-red-500 text-sm mt-1">{shippingForm.formState.errors.address.message}</p>
               )}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <input
                 type="text"
                 name="city"
                 placeholder="City"
                 className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
                 {...shippingForm.register('city')}
               />
               {shippingForm.formState.errors.city && (
                 <p className="text-red-500 text-sm mt-1">{shippingForm.formState.errors.city.message}</p>
               )}
               <input
                 type="text"
                 name="zip"
                 placeholder="ZIP Code"
                 className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
                 {...shippingForm.register('zip')}
               />
               {shippingForm.formState.errors.zip && (
                 <p className="text-red-500 text-sm mt-1">{shippingForm.formState.errors.zip.message}</p>
               )}
               <select
                 name="country"
                 className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
                 {...shippingForm.register('country')}
               >
                 <option value="">Country</option>
                 <option value="UK">United Kingdom</option>
                 <option value="US">United States</option>
                 <option value="CA">Canada</option>
                 <option value="AU">Australia</option>
               </select>
               {shippingForm.formState.errors.country && (
                 <p className="text-red-500 text-sm mt-1">{shippingForm.formState.errors.country.message}</p>
               )}
             </div>
             <div className="flex gap-4">
               <button
                 type="submit"
                 className="flex-1 bg-gold text-white px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors"
               >
                 Next: Payment
               </button>
               <button
                 type="button"
                 onClick={() => navigate('/cart')}
                 className="flex-1 bg-transparent border border-[var(--ink-10)] text-foreground px-6 py-3 rounded-lg font-medium hover:bg-[var(--ink-05)] transition-colors"
               >
                 Edit Cart
               </button>
             </div>
           </form>
         </div>
       );
     }

   if (step === 'payment') {
       return (
         <div className="max-w-2xl mx-auto px-6 md:px-10 py-12">
           <h1 className="font-display italic text-2xl font-light text-foreground mb-6">Payment Information</h1>
           <form onSubmit={handlePaymentSubmit} className="bg-[var(--cotton)] border border-[var(--ink-10)] rounded-lg p-6 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <input
                 type="text"
                 name="cardName"
                 placeholder="Cardholder Name"
                 className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
                 {...paymentForm.register('cardName')}
               />
               {paymentForm.formState.errors.cardName && (
                 <p className="text-red-500 text-sm mt-1">{paymentForm.formState.errors.cardName.message}</p>
               )}
               <input
                 type="text"
                 name="cardNumber"
                 placeholder="Card Number"
                 className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
                 {...paymentForm.register('cardNumber')}
                 maxLength={19}
               />
               {paymentForm.formState.errors.cardNumber && (
                 <p className="text-red-500 text-sm mt-1">{paymentForm.formState.errors.cardNumber.message}</p>
               )}
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               <input
                 type="text"
                 name="expiry"
                 placeholder="MM/YY"
                 className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
                 {...paymentForm.register('expiry')}
                 maxLength={5}
               />
               {paymentForm.formState.errors.expiry && (
                 <p className="text-red-500 text-sm mt-1">{paymentForm.formState.errors.expiry.message}</p>
               )}
               <input
                 type="text"
                 name="cvv"
                 placeholder="CVV"
                 className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
                 {...paymentForm.register('cvv')}
                 maxLength={3}
               />
               {paymentForm.formState.errors.cvv && (
                 <p className="text-red-500 text-sm mt-1">{paymentForm.formState.errors.cvv.message}</p>
               )}
               <select className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
                 {...paymentForm.register('cardType')}>
                 <option value="">Card Type</option>
                 <option value="Visa">Visa</option>
                 <option value="Mastercard">Mastercard</option>
                 <option value="Amex">Amex</option>
               </select>
             </div>
             <div className="flex gap-4">
               <button
                 type="submit"
                 className="flex-1 bg-gold text-white px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors"
               >
                 Review Order
               </button>
               <button
                 type="button"
                 onClick={() => setStep('shipping')}
                 className="flex-1 bg-transparent border border-[var(--ink-10)] text-foreground px-6 py-3 rounded-lg font-medium hover:bg-[var(--ink-05)] transition-colors"
               >
                 Back
               </button>
             </div>
           </form>
         </div>
       );
     }

   // Review step
   return (
     <div className="max-w-2xl mx-auto px-6 md:px-10 py-12">
       <h1 className="font-display italic text-2xl font-light text-foreground mb-6">Review Order</h1>
       <div className="bg-[var(--cotton)] border border-[var(--ink-10)] rounded-lg p-6 space-y-4">
         <h2 className="font-medium text-foreground">Shipping to:</h2>
         <p className="text-sm text-muted-dark">{shippingData.name}</p>
         <p className="text-sm text-muted-dark">{shippingData.address}, {shippingData.city}, {shippingData.zip}</p>
         <p className="text-sm text-muted-dark">{shippingData.country}</p>

         <h2 className="font-medium text-foreground mt-6">Payment Method:</h2>
         <p className="text-sm text-muted-dark">•••• •••• •••• {paymentData.cardNumber.slice(-4)}</p>

         <div className="border-t border-b py-4">
           <div className="flex justify-between text-sm text-muted-dark mb-2">
             <span>Subtotal</span>
             <span>$475.00</span>
           </div>
           <div className="flex justify-between text-sm text-muted-dark mb-2">
             <span>Shipping</span>
             <span>$5.00</span>
           </div>
           <div className="flex justify-between text-sm text-muted-dark">
             <span>Tax (8%)</span>
             <span>$38.00</span>
           </div>
           <div className="flex justify-between text-base font-display font-light text-foreground mt-2">
             <span>Total</span>
             <span className="text-gold">$518.00</span>
           </div>
         </div>

         <div className="flex gap-4">
           <button
             onClick={handleCompleteOrder}
             className="flex-1 bg-gold text-white px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors"
           >
             Place Order
           </button>
           <button
             onClick={() => setStep('payment')}
             className="flex-1 bg-transparent border border-[var(--ink-10)] text-foreground px-6 py-3 rounded-lg font-medium hover:bg-[var(--ink-05)] transition-colors"
           >
             Edit
           </button>
         </div>
       </div>
     </div>
   );
};

export default Checkout;