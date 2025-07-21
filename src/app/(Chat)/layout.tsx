import Chat from "../(ecommerce)/components/Chat";
import Header from "../(ecommerce)/components/Header";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <div className="grid grid-rows-[auto_1fr_auto] h-screen w-screen overflow-hidden">
    {/* Header - altura automática */}
    <header className="row-start-1">
      <Header />
    </header>

    {/* Contenido principal - ocupa todo el espacio disponible */}
    <main className="row-start-2 overflow-auto">
      {children}
    </main>

    {/* Footer - altura automática */}
    <footer className="row-start-3">
      <Chat />
    </footer>
  </div>
);
}
