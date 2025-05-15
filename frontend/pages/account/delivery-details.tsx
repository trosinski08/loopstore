import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import AccountLayout from '@/components/account/AccountLayout';

const deliveryDetailsSchema = z.object({
  name: z.string().min(2, 'Imię jest wymagane'),
  email: z.string().email('Nieprawidłowy adres email'),
  phone: z.string().min(9, 'Nieprawidłowy numer telefonu'),
  address: z.string().min(5, 'Adres jest wymagany'),
  city: z.string().min(2, 'Miasto jest wymagane'),
  postal_code: z.string().regex(/^\d{2}-\d{3}$/, 'Nieprawidłowy kod pocztowy (XX-XXX)'),
  country: z.string().min(2, 'Kraj jest wymagany'),
});

type DeliveryDetailsFormData = z.infer<typeof deliveryDetailsSchema>;

export default function DeliveryDetails() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<DeliveryDetailsFormData>({
    resolver: zodResolver(deliveryDetailsSchema),
  });

  const onSubmit = async (data: DeliveryDetailsFormData) => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      
      // W przyszłości - integracja z API do zapisywania danych dostawy
      await new Promise(resolve => setTimeout(resolve, 1000)); // Symulacja zapisu
      
      setSaveSuccess(true);
      // Możemy zapisać dane w localStorage do wykorzystania przy kolejnych zamówieniach
      localStorage.setItem('deliveryDetails', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving delivery details:', error);
      alert('Wystąpił błąd podczas zapisywania danych. Spróbuj ponownie później.');
    } finally {
      setIsSaving(false);
    }
  };

  // Ładowanie zapisanych danych przy pierwszym renderowaniu
  useState(() => {
    const savedDetails = localStorage.getItem('deliveryDetails');
    if (savedDetails) {
      reset(JSON.parse(savedDetails));
    }
  });

  return (
    <AccountLayout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-lg leading-6 font-medium text-gray-900">
            Dane dostawy
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Twoje domyślne dane dostawy będą używane przy składaniu zamówień
          </p>
        </div>

        <div className="border-t border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Imię i nazwisko
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefon
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Adres
                </label>
                <input
                  type="text"
                  {...register('address')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Miasto
                </label>
                <input
                  type="text"
                  {...register('city')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kod pocztowy
                </label>
                <input
                  type="text"
                  {...register('postal_code')}
                  placeholder="XX-XXX"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.postal_code && (
                  <p className="mt-1 text-sm text-red-600">{errors.postal_code.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kraj
                </label>
                <input
                  type="text"
                  {...register('country')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                )}
              </div>
            </div>

            {saveSuccess && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Dane zostały zapisane pomyślnie
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {isSaving ? 'Zapisywanie...' : 'Zapisz dane'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AccountLayout>
  );
} 