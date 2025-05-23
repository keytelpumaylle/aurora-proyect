import { getProducts } from "@/api/Products"
import Image from "next/image"

interface Products{
  id: number,
        name: string,
        description: string,
        indication: string,
        contraindication: string,
        dose: string,
        price: number,
  imageUrl: string
}

  export default async function Products() {
    const products = await getProducts()
    return (
      <div className="bg-white pt-4 mb-30">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Tu salud es nuestra prioridad</h2>
  
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product:Products) => (
              <div key={product.id} className="">
                <Image
                  alt={product.name}
                  src={'https://dcuk1cxrnzjkh.cloudfront.net/imagesproducto/424751L.jpg'}
                  width={250}
                  height={250}
                  className="aspect-square w-full rounded-md bg-gray-800 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-50"
                />
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="">
                      <a>
                        <span aria-hidden="true" className="" />
                        {product.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                  </div>
                  <p className=" font-bold text-gray-900">s/{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  