'use server'

export async function getProducts() {
    try {
        const response = await fetch(`${process.env.BACK_URL}/api/v1/medications`,{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.data.medications; // Retorna directamente el array de entities
    } catch (error) {
        console.error('Error fetching products:', error);
        return []; // Retorna array vacío en caso de error
    }
}

export async function registerProducts(state:any, formData:FormData){
    
    const value = {
        name: formData.get('name'),
        description: formData.get('description'),
        indication: formData.get('indication'),
        contraindication: formData.get('contraindication'),
        dose: formData.get('dose'),
        price: formData.get('price'),
    }

    const response = await fetch(`${process.env.BACK_URL}/api/v1/medications`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        // Enviamos directamente el objeto value sin envolverlo en otro objeto
        body: JSON.stringify(value),
    })

    const data = await response.json()
    console.log(data)

}