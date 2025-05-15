import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useRouter } from 'next/router';

// Schemat walidacji dla formularza
const checkoutSchema = z.object({
  name: z.string().min(2, 'Imię jest wymagane'),
  email: z.string().email('Nieprawidłowy adres email'),
  phone: z.string().min(9, 'Nieprawidłowy numer telefonu'),
  address: z.string().min(5, 'Adres jest wymagany'),
  city: z.string().min(2, 'Miasto jest wymagane'),
  postal_code: z.string().regex(/^\d{2}-\d{3}$/, 'Nieprawidłowy kod pocztowy (XX-XXX)'),
  country: z.string().min(2, 'Kraj jest wymagany'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const steps = ['Dane osobowe', 'Adres dostawy', 'Podsumowanie'];

export default function CheckoutForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cartItems, clearCart, total } = useCart();
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsSubmitting(true);
      
      const orderData = {
        ...data,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: total,
      };

      const response = await axios.post('http://localhost:8000/api/orders/', orderData);
      
      if (response.status === 201) {
        clearCart();
        router.push(`/order-confirmation/${response.data.id}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      // Show error message
      alert('Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie później.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Imię i nazwisko</label>
        <input
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Telefon</label>
        <input
          type="tel"
          {...register('phone')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
      </div>
    </div>
  );

  const renderShippingInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Adres</label>
        <input
          {...register('address')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Miasto</label>
        <input
          {...register('city')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Kod pocztowy</label>
        <input
          {...register('postal_code')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.postal_code && <p className="mt-1 text-sm text-red-600">{errors.postal_code.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Kraj</label>
        <input
          {...register('country')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Podsumowanie zamówienia</h3>
      <div className="border-t border-b py-4">
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between py-2">
            <span>{item.name} x {item.quantity}</span>
            <span>{(item.price * item.quantity).toFixed(2)} zł</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between font-medium">
        <span>Suma</span>
        <span>{total.toFixed(2)} zł</span>
      </div>
      <div className="mt-6">
        <h4 className="font-medium">Dane dostawy:</h4>
        <p>{watch('name')}</p>
        <p>{watch('email')}</p>
        <p>{watch('phone')}</p>
        <p>{watch('address')}</p>
        <p>{watch('postal_code')} {watch('city')}</p>
        <p>{watch('country')}</p>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderShippingInfo();
      case 2:
        return renderSummary();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className={`flex items-center ${index <= currentStep ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 
                  ${index <= currentStep ? 'border-indigo-600' : 'border-gray-400'}`}>
                  {index + 1}
                </div>
                <span className="ml-2">{step}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-1 w-16 ${index < currentStep ? 'bg-indigo-600' : 'bg-gray-300'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {renderStep()}
        
        <div className="flex justify-between mt-8">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Wstecz
            </button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Dalej
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {isSubmitting ? 'Przetwarzanie...' : 'Złóż zamówienie'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 