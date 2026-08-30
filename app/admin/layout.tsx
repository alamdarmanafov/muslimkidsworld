import { AdminGate } from "../../components/admin/AdminGate";
import { AdminSidebar } from "../../components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate>
      <div className="flex min-h-screen bg-surface text-ink">
        <AdminSidebar />
        <div className="flex-1 overflow-x-hidden">{children}</div>
      </div>
    </AdminGate>
  );
}
