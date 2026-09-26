import type { ReactNode } from "react";
import { MuseumRuntime } from "@/components/MuseumRuntime";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <MuseumRuntime />
      <main id="main" className="mx-auto w-full max-w-[1180px]">
        {children}
      </main>
    </div>
  );
}
