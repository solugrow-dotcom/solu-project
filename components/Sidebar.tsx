"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Sidebar() {
    const pathname = usePathname()

    const menuItems = [
        { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
        { icon: "groups", label: "Members", href: "/member" },
        { icon: "calendar_month", label: "Attendance", href: "/attendance" },
        { icon: "psychology", label: "AI Lab", href: "/ai-lab" },
        { icon: "payments", label: "Payments", href: "/payments" },
        { icon: "recipe", label: "Plans", href: "/plans" },
        { icon: "warning", label: "Alerts", href: "/expiry" },
        { icon: "person", label: "Trainer View", href: "/trainer" },
        { icon: "settings", label: "Settings", href: "/admin" },
    ]

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    return (
        <aside className="w-64 h-screen bg-[#1a110a] border-r border-white/10 flex flex-col fixed left-0 top-0">
            <div className="p-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined font-bold">fitness_center</span>
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">SoluGrow</h1>
                    <p className="text-[10px] text-primary uppercase font-black">Gym Pro</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="font-bold text-sm tracking-tight">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-bold text-sm"
                >
                    <span className="material-symbols-outlined">logout</span>
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
