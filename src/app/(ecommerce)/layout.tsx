import Chat from "./components/Chat";
import Header from "./components/Header";

export default async function EcommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="">
        {children}
      </main>
      <footer className="fixed bottom-0  w-full  z-50">
        <Chat />
      </footer>
    </>
  );
}