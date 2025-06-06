import Image from "next/image";
import Link from "next/link";

interface Props {
    id: number,
    name: string,
    description: string,
    indication: string,
    contraindication: string,
    dose: string,
    price: number,
    imageUrl: string
}

export default function Medication(props: Props) {
    return (
        <Link
  key={props.id}
  href={`/${props.name}`}
  className="group relative block rounded-md overflow-hidden p-0.5 transition-all duration-300 h-full"
>
  {/* Fondo degradado que aparece al hacer hover */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#885BDA] to-[#66D6D7] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md z-0"></div>

  {/* Contenedor interno con altura fija */}
  <div className="relative bg-white rounded-md z-10 overflow-hidden h-full flex flex-col">
    {/* Sección de imagen con altura proporcional */}
    <div className="relative aspect-square">
      <Image
        alt={props.name}
        src={props.imageUrl}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
      />
    </div>

    {/* Sección de contenido con altura fija */}
    <div className="p-4 flex-1 flex flex-col">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 h-6">
          {props.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-3 h-6">
          {props.description}
        </p>
      </div>
      <p className="font-bold text-gray-900 mt-auto pt-2">
        s/{props.price.toFixed(2)}
      </p>
    </div>
  </div>
</Link>
    );
}