"use client"

import { indication } from "@/api/Chat"
import { Mic, ArrowUp, LoaderCircle } from "lucide-react"
import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"

const STORAGE_EVENT = 'chatResultsUpdated';

export default function ChatInterface() {
  const router = useRouter()
  const [state, action, pending] = useActionState(indication, undefined)

  // Redirección automática cuando el estado cambia
  useEffect(() => {
    if (state) {
      sessionStorage.setItem('chatResults', JSON.stringify(state)) // respuesta alamacenada temporalmente
      // Disparar evento personalizado
      window.dispatchEvent(new CustomEvent(STORAGE_EVENT, {
        detail: state
      }));
      
      router.push("/chat")
    }
  }, [state, router])

  return (
    <div className="px-2 md:px-[180px] py-2 md:py-4 bg-white border-t-1 border-gray-300">
  <form action={action}>
    {/* Contenedor principal con efecto de sombra degradada */}
    <div className="relative bg-white border border-gray-300 rounded-xl shadow-lg group">
      {/* Sombra degradada con desenfoque */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8C44C2] to-[#07050A] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
      </div>
      
      <div className="flex gap-2 md:gap-4 items-center px-1 md:px-4">
        <button
          type="button"
          className=" bg-gray-200 rounded-full p-3 md:p-4 hover:bg-gradient-to-r hover:from-[#8C44C2] hover:to-[#07050A] hover:text-white transition-all duration-300"
        >
          <Mic size={20} />
        </button>

        <input
          name="indication"
          placeholder="Cuéntame. ¿Qué síntomas tienes?..."
          className="flex-1 bg-transparent border-0 focus:outline-none placeholder:text-zinc-500 py-6 group-hover:placeholder:text-[#885BDA]/70 transition-colors duration-300"
          disabled={pending}
        />

        
        {pending ? (
          <button
          type="submit"
          disabled={pending}
          className={`rounded-full p-3 md:p-4 bg-gradient-to-r from-[#8C44C2] to-[#07050A] text-white transition-all duration-300 disabled:cursor-not-allowed` }
        >
          <LoaderCircle size={18} className="animate-spin text-dark" />
        </button>
        ):(<button
          type="submit"
          className={` bg-gray-200 rounded-full p-3 md:p-4 hover:bg-gradient-to-r hover:from-[#8C44C2] hover:to-[#07050A] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed` }
        >
          <ArrowUp size={18} />
        </button>)}
      </div>
    </div>
  </form>
</div>
  )
}
