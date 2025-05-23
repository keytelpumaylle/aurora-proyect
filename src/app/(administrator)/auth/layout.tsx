export default async function AdministratorLayout({children,}: {
    children: React.ReactNode;
  }) {
  
    return (
        <>
        <main>
          {children}
        </main>
      </>
    );
  }