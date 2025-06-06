
import Chat from "../(ecommerce)/components/Chat";
import Header from "../(ecommerce)/components/Header";

export default async function ChatLayout({children,}: {
    children: React.ReactNode;
  }) {
  
    return (
        <>
        <Header/>
        <main>
          {children}
        </main>
        <footer className="fixed bottom-0  w-full  z-50">
        <Chat/>
      </footer>
      </>
    );
  }