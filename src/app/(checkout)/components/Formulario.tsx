
export default function Formulario() {
  return (
    <form className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <label>Nombre</label>
            <input name="name" type="text" className="border-gray border-[1px] px-4 py-2 rounded-md focus:outline-none focus:border-dark" placeholder="Ej. aura"/>
          </div>
          <div className='flex flex-col gap-1'>
            <label>Apellido completos</label>
            <input name="lastname" className="border-gray border-[1px] px-4 py-2 rounded-md focus:outline-none focus:border-dark" placeholder="Ej. apellido" />
          </div>
          <div className='flex flex-col gap-1 pb-8'>
            <label>WhatsApp</label>
            <input name="phone" className="border-gray border-[1px] px-4 py-2 rounded-md focus:outline-none focus:border-dark" placeholder="999 687 111"/>
          </div>
          <button className='bg-gray rounded-lg py-6  hover:bg-gradient-to-r hover:from-[#885BDA] hover:to-[#66D6D7]  transition-all duration-300'>Realizar pedido</button>
        </form>
  );
}