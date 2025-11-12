
import Image from 'next/image';
import Yape from '@/images/yape-seeklogo.png';
import Plin from '@/images/plin-seeklogo.png';
import { HandCoins, ArrowLeft, ShieldCheck } from 'lucide-react';
import HistorialProductos from '../components/HistorialProductos';
import Link from 'next/link';
import Formulario from '../components/Formulario';


export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-graylight via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fadeInUp">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Finalizar compra
            </h1>
            <div className="flex items-center gap-2 text-sm text-graydark/60">
              <ShieldCheck size={16} className="text-primary"/>
              <span>Proceso de pago seguro</span>
            </div>
          </div>
          <Link
            href={'/'}
            className='flex items-center gap-2 text-sm font-medium text-graydark/70 hover:text-primary transition-colors group'
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/>
            Regresar
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Payment & Form */}
          <div className="lg:col-span-8 space-y-8">
            {/* Payment Methods */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200/50 animate-fadeInUp">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-graydark mb-2">Método de pago</h2>
                <p className="text-sm text-graydark/60">Selecciona cómo deseas pagar tu pedido</p>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <label className="group cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    className="hidden peer"
                    value="2"
                  />
                  <div className="relative h-full p-6 border-2 border-gray-200 rounded-xl transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/50 hover:shadow-md flex flex-col items-center gap-3">
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-primary peer-checked:bg-primary transition-all group-hover:border-primary/50">
                      <div className="hidden peer-checked:block absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <Image
                      alt='Logo de yape'
                      src={Yape}
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                    <h3 className="font-semibold text-graydark">Yape</h3>
                  </div>
                </label>

                <label className="group cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    className="hidden peer"
                    value="3"
                  />
                  <div className="relative h-full p-6 border-2 border-gray-200 rounded-xl transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/50 hover:shadow-md flex flex-col items-center gap-3">
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-primary peer-checked:bg-primary transition-all group-hover:border-primary/50">
                      <div className="hidden peer-checked:block absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <Image
                      alt='Logo de Plin'
                      src={Plin}
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                    <h3 className="font-semibold text-graydark">Plin</h3>
                  </div>
                </label>

                <label className="group cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    className="hidden peer"
                    value="1"
                  />
                  <div className="relative h-full p-6 border-2 border-gray-200 rounded-xl transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/50 hover:shadow-md flex flex-col items-center gap-3">
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-primary peer-checked:bg-primary transition-all group-hover:border-primary/50">
                      <div className="hidden peer-checked:block absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <HandCoins size={60} strokeWidth={1.2} className="text-graydark"/>
                    <h3 className="font-semibold text-graydark">Efectivo</h3>
                  </div>
                </label>
              </div>
            </div>

            {/* Customer Information Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200/50 animate-fadeInUp">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-graydark mb-2">Información de contacto</h2>
                <p className="text-sm text-graydark/60">Completa tus datos para recibir el pedido</p>
              </div>
              <Formulario/>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 sticky top-24 animate-fadeInUp">
              <h2 className="text-xl font-bold text-graydark mb-6">Resumen del pedido</h2>
              <HistorialProductos/>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}