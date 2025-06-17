import Link from "next/link";
import { House,Pill,Store } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-gray-200 border-r shadow h-full p-8">
        <h2 className="font-bold text-3xl text-center mb-6">Aura</h2>
      <ul>
        <Link href={'/farma'}>
        <li className="flex gap-4 py-3 hover:text-blue-500">
            <House/>
            <span>Home</span>
        </li>
        </Link>
        <Link href={'/farma/products'}>
        <li className="flex gap-4 py-3 hover:text-blue-500">
            <Pill/>
            <span>Medicamentos</span>
        </li>
        </Link>
        <Link href={'/'}>
        <li className="flex gap-4 py-3 hover:text-blue-500">
            <Store/>
            <span>Ver tienda</span>
        </li>
        </Link>
        <Link href={'/'}>
        <li className="flex gap-4 py-3 hover:text-blue-500">
            <House/>
            <span>Home</span>
        </li>
        </Link>
        
      </ul>
    </nav>
  );
}