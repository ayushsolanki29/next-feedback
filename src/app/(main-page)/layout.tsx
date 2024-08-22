import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Dashboard |   Secret Sender",
  description: " Unlock the full potential of your platform with insights and strategies designed to enhance user experience and boost conversions.",
};

export default function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Navbar />
      {children}
      <Footer/>
    </main>
  );
}
