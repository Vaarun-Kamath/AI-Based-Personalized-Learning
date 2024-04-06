import Sidebar from "@/components/Sidebar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex max-w-screen mt-20">
      <Sidebar />
      {children}
    </div>
  );
}
