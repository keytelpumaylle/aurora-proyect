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
        <div className="bg-white border border-gray-300 shadow-lg rounded-lg">
          <div className="flex gap-2 md:gap-4 items-center px-1 md:px-4">
            <button
              type="button"
              className="text-zinc-400 bg-gray-200 rounded-full p-3 md:p-4 hover:bg-[#4F46E5] hover:text-white transition-colors"
            >
              <Mic size={20} />
            </button>

            <input
              name="indication"
              placeholder="Cuéntame. ¿Qué síntomas tienes?..."
              className="flex-1 bg-transparent border-0 focus:outline-none placeholder:text-zinc-500 py-6"
              disabled={pending}
            />

            <button
              type="submit"
              disabled={pending}
              className="bg-gray-200 rounded-full p-3 md:p-4 hover:bg-[#4F46E5] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <ArrowUp size={18} />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
