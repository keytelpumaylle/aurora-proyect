import Chat from "./components/Chat";
import Header from "./components/Header";
import NotificationContainer from "@/components/NotificationContainer";

export default async function EcommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-graylight via-white to-gray-100">
      <Header/>

      {/* Layout principal: 2 columnas en desktop */}
      <main className="max-w-[1920px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-6">
          {/* Columna izquierda - Productos (scroll) */}
          <div className="flex-1 overflow-y-auto pb-32 lg:pb-8">
            {children}
          </div>

          {/* Columna derecha - Chat AI (sticky en desktop, fixed en mobile) */}
          <aside className="lg:w-[400px] lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:py-6 lg:pr-6">
            <div className="hidden lg:block h-full">
              <Chat />
            </div>

            {/* Chat fijo en la parte inferior en mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
              <Chat />
            </div>
          </aside>
        </div>
      </main>

      {/* Sistema de notificaciones global */}
      <NotificationContainer />
    </div>
  );
}