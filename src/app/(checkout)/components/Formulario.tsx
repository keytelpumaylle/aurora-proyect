
export default function Formulario() {
  return (
    <form className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <label className="text-sm font-semibold text-graydark">
          Nombre <span className="text-accent">*</span>
        </label>
        <input
          name="name"
          type="text"
          className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white/50"
          placeholder="Ej. Juan"
          required
        />
      </div>

      <div className='flex flex-col gap-2'>
        <label className="text-sm font-semibold text-graydark">
          Apellidos completos <span className="text-accent">*</span>
        </label>
        <input
          name="lastname"
          type="text"
          className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white/50"
          placeholder="Ej. Pérez García"
          required
        />
      </div>

      <div className='flex flex-col gap-2'>
        <label className="text-sm font-semibold text-graydark">
          Número de WhatsApp <span className="text-accent">*</span>
        </label>
        <input
          name="phone"
          type="tel"
          className="border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white/50"
          placeholder="999 687 111"
          required
        />
      </div>

      <button
        type="submit"
        className='group relative w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 px-6 rounded-xl hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 mt-4'
      >
        <span>Realizar pedido</span>
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
        </svg>
      </button>
    </form>
  );
}