import Chat from "./components/Chat";
import Header from "./components/Header";
import ModalInfoUser from "./components/ModalInfo";

export default async function EcommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ModalInfoUser/>
      <Header/>
      <main className="">
        {children}
      </main>
      <footer className="">
        <Chat />
      </footer>
    </>
  );
}