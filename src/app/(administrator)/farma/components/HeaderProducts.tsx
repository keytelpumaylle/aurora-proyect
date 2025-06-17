import Link from "next/link";

export default function HeaderProducts() {
  return (
    <header className="justify-between items-center flex py-4 px-8 border-gray-200 border-b-1">
      <div className="">
      <h2 className="text-2xl font-bold tracking-tight ">Mis medicamentos</h2>
      <p className="text-sm font-light">Crea, Gestiona y configura tus medicamentos</p>
      </div>
      <Link className="bg-gradient-to-r from-[#885BDA] to-[#66D6D7] px-4 py-2 rounded-md cursor-pointer" href="/farma/products">Crear nuevo</Link>
    </header>
  );
}