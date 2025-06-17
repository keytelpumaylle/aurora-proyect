import { getProducts } from "@/api/Products"
import Medication from "./medication"

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
      <div className="bg-white pt-2 mb-30 h-[calc(100vh-180px)] overflow-y-auto space-y-6">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
  
          <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-12">
            {products.map((product:Products) => (
              <Medication
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                indication={product.indication}
                contraindication={product.contraindication}
                dose={product.dose}
                price={product.price}
                imageUrl={product.imageUrl || 'https://dcuk1cxrnzjkh.cloudfront.net/imagesproducto/424751L.jpg'}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
  