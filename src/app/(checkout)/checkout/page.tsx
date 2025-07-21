
import Image from 'next/image';
import Yape from '@/images/yape-seeklogo.png';
import Plin from '@/images/plin-seeklogo.png';
import { HandCoins } from 'lucide-react';
import HistorialProductos from '../components/HistorialProductos';
import Link from 'next/link';
import Formulario from '../components/Formulario';


export default function CheckoutPage() {
  return (
    <main className="grid grid-cols-12 grid-rows-12 gap-14 py-12 px-28">
      <div className="col-span-9 row-span-12">
        <div className='flex items-center justify-between'>
          <h2 className="font-bold text-3xl pb-4">Finalizar compra</h2>
          <Link href={'/'} className='text-sm font-light hover:underline'>
          Regresar
          </Link>
        </div>
        <p className="text-gray-800">Seleccion un metodo de pago.</p>
        <div className='my-2 flex  gap-2'>
          <label className="group cursor-pointer flex justify-center">
              <input
                type="radio"
                name="payment"
                className="hidden peer"
                value="2"
              />
              <div className="px-6 py-4 border-gray border-1 rounded-lg transition-all peer-checked:bg-blue hover:bg-blue flex items-center w-full gap-4">
                  <Image
                    alt='Logo de yape'
                    src={Yape}
                    width={50}
                    height={50}
                    className="object-contain rounded-md"
                  />
                
                <h3 className=" text-center">Yape</h3>
              </div>
            </label>

            <label className="group cursor-pointer flex justify-center">
              <input
                type="radio"
                name="payment"
                className="hidden peer"
                value="3"
              />
              <div className="px-6 py-4 border-gray border-1 rounded-lg transition-all peer-checked:bg-blue hover:bg-blue flex items-center w-full gap-4">
                  <Image
                    alt='Logo de Plin'
                    src={Plin}
                    width={50}
                    height={50}
                    className="object-contain rounded-md"
                  />
                
                <h3 className=" text-center">Plin</h3>
              </div>
            </label>
            <label className="group cursor-pointer flex justify-center">
              <input
                type="radio"
                name="payment"
                className="hidden peer"
                value="1"
              />
              <div className="px-6 py-4 border-gray border-1 rounded-lg transition-all peer-checked:bg-blue hover:bg-blue flex items-center w-full gap-4">
                <HandCoins size={50} strokeWidth={1.1}/>
                <h3 className=" text-center">Pagar en efectivo</h3>
              </div>
            </label>
        </div>
        <p className="text-gray-800 pt-6 pb-4">Complete su informacion.</p>
        <Formulario/>

      </div>
      <div className="col-span-3 row-span-12 col-start-10">
        <HistorialProductos/>
      </div>
    </main>
  );
}