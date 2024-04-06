import Sidebar from "@/components/Sidebar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="flex max-w-screen h-screen pt-20 p-7">{children}</div>
    </>
  );
}
