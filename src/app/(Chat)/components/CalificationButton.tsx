"use client";
import { registrarCalificacion } from "@/api/CalificationSubmit";
import { useCalificationModal } from "@/store/Calification";
import { useState } from "react";

export default function CalificationButton() {
  const { open, responseTrue, state, close } = useCalificationModal();

  const [answers, setAnswers] = useState({
    q1: "", q2: "", q3: "", q4: "", q5: "", q6: "", q7: ""
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAnswers(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  const allAnswered = Object.values(answers).every(val => val !== "");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await registrarCalificacion(formData);
    responseTrue();
    close();
  }

  if (!state)
    return (
      <button
        onClick={open}
        className="bg-gradient-to-r from-[#885BDA] to-[#66D6D7] text-dark px-4 rounded-lg font-semibold py-3 hover:cursor-pointer"
      >
        Califica esta consulta
      </button>
    );
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#12121250] p-2">
      <div className="bg-white w-full max-w-md md:max-w-2xl lg:max-w-3xl h-auto md:h-screen rounded-lg py-6 px-4 md:py-8 md:px-12 shadow-lg flex flex-col justify-center">
        <form onSubmit={handleSubmit}>
          <article className="overflow-hidden flex flex-col h-auto md:h-[550px]">
            <header className="mb-4 flex flex-col gap-3">
              <h3 className="font-bold text-2xl md:text-3xl">
                Evaluación de la Experiencia de Usuario
              </h3>
              <p className="text-sm md:text-base">
                <strong>Instrucciones:</strong> Califica las <strong>7</strong>
                afirmaciones según tu experiencia con Project Aura, donde 1 es
                &quot;Peor experiencia&quot; y 5 es &quot;Excelente experiencia&quot;.
              </p>
            </header>
            <main className="px-2 md:px-4 pb-4 flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-graylight pr-0 md:pr-4 scrollbar-thumb-rounded-full">
              <ul className="list-decimal space-y-4">
                <li>
                  <label>
                    El sistema fue fácil y cómodo de utilizar para describir mis
                    síntomas
                  </label>
                  <div className="flex gap-4">
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q1"
                        className="hidden peer"
                        checked={answers[`q1`] === String(1)}
                        value="1"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">1</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q1"
                        className="hidden peer"
                        checked={answers[`q1`] === String(2)}
                        value="2"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">2</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q1"
                        className="hidden peer"
                        checked={answers[`q1`] === String(3)}
                        value="3"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">3</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q1"
                        className="hidden peer"
                        checked={answers[`q1`] === String(4)}
                        value="4"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">4</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q1"
                        className="hidden peer"
                        checked={answers[`q1`] === String(5)}
                        value="5"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">5</h3>
                      </div>
                    </label>
                  </div>
                </li>

                <li>
                  <label>
                    Las indicaciones y respuestas del sistema fueron claras y
                    comprensibles.
                  </label>
                  <div className="flex gap-4">
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q2"
                        className="hidden peer"
                        checked={answers[`q2`] === String(1)}
                        value="1"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">1</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q2"
                        className="hidden peer"
                        checked={answers[`q2`] === String(2)}
                        value="2"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">2</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q2"
                        className="hidden peer"
                        checked={answers[`q2`] === String(3)}
                        value="3"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">3</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q2"
                        className="hidden peer"
                        checked={answers[`q2`] === String(4)}
                        value="4"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">4</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q2"
                        className="hidden peer"
                        checked={answers[`q2`] === String(5)}
                        value="5"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">5</h3>
                      </div>
                    </label>
                  </div>
                </li>

                <li>
                  <label>
                    La recomendación proporcionada por Project Aura fue adecuada
                    para mi malestar.
                  </label>
                  <div className="flex gap-4">
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q3"
                        className="hidden peer"
                        checked={answers[`q3`] === String(1)}
                        value="1"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">1</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q3"
                        className="hidden peer"
                        checked={answers[`q3`] === String(2)}
                        value="2"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">2</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q3"
                        className="hidden peer"
                        checked={answers[`q3`] === String(3)}
                        value="3"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">3</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q3"
                        className="hidden peer"
                        checked={answers[`q3`] === String(4)}
                        value="4"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">4</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q3"
                        className="hidden peer"
                        checked={answers[`q3`] === String(5)}
                        value="5"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">5</h3>
                      </div>
                    </label>
                  </div>
                </li>

                <li>
                  <label>
                    Confío en las sugerencias y recomendaciones entregadas por
                    el sistema.
                  </label>
                  <div className="flex gap-4">
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q4"
                        className="hidden peer"
                        checked={answers[`q4`] === String(1)}
                        value="1"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">1</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q4"
                        className="hidden peer"
                        checked={answers[`q4`] === String(2)}
                        value="2"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">2</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q4"
                        className="hidden peer"
                        checked={answers[`q4`] === String(3)}
                        value="3"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">3</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q4"
                        className="hidden peer"
                        checked={answers[`q4`] === String(4)}
                        value="4"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">4</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q4"
                        className="hidden peer"
                        checked={answers[`q4`] === String(5)}
                        value="5"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">5</h3>
                      </div>
                    </label>
                  </div>
                </li>

                <li>
                  <label>
                    La información recibida me ayudó a tomar mejores decisiones
                    sobre mi salud.
                  </label>
                  <div className="flex gap-4">
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q5"
                        className="hidden peer"
                        checked={answers[`q5`] === String(1)}
                        value="1"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">1</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q5"
                        className="hidden peer"
                        checked={answers[`q5`] === String(2)}
                        value="2"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">2</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q5"
                        className="hidden peer"
                        checked={answers[`q5`] === String(3)}
                        value="3"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">3</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q5"
                        className="hidden peer"
                        checked={answers[`q5`] === String(4)}
                        value="4"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">4</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q5"
                        className="hidden peer"
                        checked={answers[`q5`] === String(5)}
                        value="5"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">5</h3>
                      </div>
                    </label>
                  </div>
                </li>

                <li>
                  <label>
                    En general, quedé satisfecho(a) con la experiencia de
                    consulta a través de Project Aura.
                  </label>
                  <div className="flex gap-4">
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q6"
                        className="hidden peer"
                        checked={answers[`q6`] === String(1)}
                        value="1"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">1</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q6"
                        className="hidden peer"
                        checked={answers[`q6`] === String(2)}
                        value="2"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">2</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q6"
                        className="hidden peer"
                        checked={answers[`q6`] === String(3)}
                        value="3"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">3</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q6"
                        className="hidden peer"
                        checked={answers[`q6`] === String(4)}
                        value="4"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">4</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q6"
                        className="hidden peer"
                        checked={answers[`q6`] === String(5)}
                        value="5"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">5</h3>
                      </div>
                    </label>
                  </div>
                </li>

                <li>
                  <label>Recomendaría Project Aura a otras personas.</label>
                  <div className="flex gap-4">
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q7"
                        className="hidden peer"
                        checked={answers[`q7`] === String(1)}
                        value="1"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">1</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q7"
                        className="hidden peer"
                        checked={answers[`q7`] === String(2)}
                        value="2"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">2</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q7"
                        className="hidden peer"
                        checked={answers[`q7`] === String(3)}
                        value="3"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">3</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q7"
                        className="hidden peer"
                        checked={answers[`q7`] === String(4)}
                        value="4"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">4</h3>
                      </div>
                    </label>
                    <label className="group cursor-pointer">
                      <input
                        type="radio"
                        name="q7"
                        className="hidden peer"
                        checked={answers[`q7`] === String(5)}
                        value="5"
                        onChange={handleChange}
                      />
                      <div className=" border-gray border-1 rounded-full w-10 h-10 transition-all peer-checked:bg-blue hover:bg-blue flex justify-center items-center">
                        <h3 className="">5</h3>
                      </div>
                    </label>
                  </div>
                </li>
              </ul>
            </main>
          </article>
          <div className="flex flex-col justify-center mt-4">
            <button
              type="submit"
              disabled={!allAnswered}
              className={`bg-gradient-to-r from-[#885BDA] to-[#66D6D7] text-dark px-4 rounded-lg font-semibold py-3 hover:cursor-pointer ${!allAnswered ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Enviar cuestionario
            </button>
            <button
              type="button"
              onClick={close}
              className="hover:underline hover:cursor-pointer mt-2"
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
