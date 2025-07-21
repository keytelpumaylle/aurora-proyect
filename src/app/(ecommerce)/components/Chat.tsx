"use client";

import { indication } from "@/api/Chat";
import {
  Mic,
  ArrowUp,
  LoaderCircle,
  MessageCircle,
  Languages,
} from "lucide-react";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STORAGE_EVENT = "chatResultsUpdated";

export default function ChatInterface() {
  const router = useRouter();
  const [state, action, pending] = useActionState(indication, undefined);

  // Redirección automática cuando el estado cambia
  useEffect(() => {
    if (state) {
      sessionStorage.setItem("chatResults", JSON.stringify(state)); // respuesta alamacenada temporalmente
      // Disparar evento personalizado
      window.dispatchEvent(
        new CustomEvent(STORAGE_EVENT, {
          detail: state,
        })
      );

      router.push("/chat");
    }
  }, [state, router]);

  return (
    <div className="px-2 md:px-[100px] py-2 md:py-4 bg-white border-t-1 border-gray-300 flex justify-between items-center gap-8 fixed bottom-0 w-full z-50">
      <form action={action} className="flex-1">
        {/* Contenedor principal con efecto de sombra degradada */}
        <div className="relative bg-white border border-gray-300 rounded-xl shadow-lg group">
          {/* Sombra degradada con desenfoque */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8C44C2] to-[#07050A] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          </div>

          <div className="flex gap-2 md:gap-2 items-center px-1 md:px-4">
            <button
              type="button"
              className="bg-gray-200 rounded-full p-2 md:p-3 hover:bg-gradient-to-r hover:from-[#885BDA] hover:to-[#66D6D7] hover:text-white transition-all duration-300"
            >
              <Mic size={20} />
            </button>

            <Link
              href={"/chat"}
              type="button"
              className="bg-graylight rounded-full p-2 md:p-3 hover:bg-gradient-to-r hover:from-[#885BDA] hover:to-[#66D6D7] hover:text-white transition-all duration-300"
            >
              <MessageCircle size={21} />
            </Link>

            <div role="group" className="relative inline-block">
              <input
                type="checkbox"
                id="language-toggle"
                className="sr-only peer" // Oculta el checkbox pero mantiene accesibilidad
              />

              <label
                htmlFor="language-toggle"
                className="flex gap-1 items-center bg-graylight p-3 rounded-full cursor-pointer
              transition-all duration-200
              hover:bg-gray-200
              peer-checked:bg-gradient-to-r peer-checked:from-[#885BDA] peer-checked:to-[#66D6D7] peer-checked:text-white peer-checked:shadow-md"
              >
                <Languages className="w-5 h-5" />
              </label>
            </div>

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
                className={`rounded-full p-2 md:p-3 bg-gradient-to-r from-[#8C44C2] to-[#07050A] text-white transition-all duration-300 disabled:cursor-not-allowed`}
              >
                <LoaderCircle size={20} className="animate-spin text-dark" />
              </button>
            ) : (
              <button
                type="submit"
                className={`bg-gray-200 rounded-full p-2 md:p-3 hover:bg-gradient-to-r hover:from-[#885BDA] hover:to-[#66D6D7] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ArrowUp size={20} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
