import Navbar from "./components/Nabvar";

export default async function AdministratorFarmaLayout({children,}: {
    children: React.ReactNode;
  }) {
  
    return (
      <>
      <div className="h-screen grid grid-cols-12 grid-rows-12 gap-0">
        <div className="col-span-2 row-span-12"><Navbar/></div>
        <main className="col-span-10 row-span-12 col-start-3">{children}</main>
    </div>
      </>
    );
  }