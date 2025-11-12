import { createRootRoute, Outlet } from "@tanstack/react-router"
import { Sidebar } from "@/components/Sidebar"

export const __rootRoute = createRootRoute({
  component: () => (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  ),
})
