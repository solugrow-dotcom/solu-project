"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"

export default function Dashboard() {
    const router = useRouter()
    const [stats, setStats] = useState({
        members: 0,
        attendance: 0,
        revenue: 0,
        expiring: 0
    })
    const [loading, setLoading] = useState(true)

    async function loadData() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/login")
                return
            }

            const { data: gymData, error: gymError } = await supabase
                .from("gyms")
                .select("id")
                .eq("owner_id", user.id)
                .single()

            if (gymError || !gymData) throw gymError || new Error("Gym not found")
            const gymId = gymData.id

            const today = new Date().toISOString().split("T")[0]

            const [membersRes, attendanceRes, paymentsRes, expiringRes] = await Promise.all([
                supabase.from("members").select("id", { count: 'exact' }).eq("gym_id", gymId),
                supabase.from("attendance").select("id", { count: 'exact' }).eq("gym_id", gymId).eq("date", today),
                supabase.from("payments").select("amount").eq("gym_id", gymId),
                supabase.from("members").select("id", { count: 'exact' }).eq("gym_id", gymId).lte("membership_end", today)
            ])

            const totalRevenue = paymentsRes.data?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0

            setStats({
                members: membersRes.count || 0,
                attendance: attendanceRes.count || 0,
                revenue: totalRevenue,
                expiring: expiringRes.count || 0
            })
        } catch (error: any) {
            console.error("Error loading dashboard data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    if (loading) return <div className="min-h-screen bg-[#1a110a] flex items-center justify-center text-primary font-bold">Loading Dashboard...</div>

    return (
        <div className="flex bg-[#1a110a]">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-slate-100 uppercase tracking-tighter">Gym Overview</h1>
                    <p className="text-slate-400 font-medium">Business intelligence for your fitness center</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Total Members", value: stats.members, icon: "groups", color: "text-blue-500 bg-blue-500/10" },
                        { label: "Today's Attendance", value: stats.attendance, icon: "event_available", color: "text-primary bg-primary/10" },
                        { label: "Monthly Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: "payments", color: "text-green-500 bg-green-500/10" },
                        { label: "Expiring Soon", value: stats.expiring, icon: "warning", color: "text-red-500 bg-red-500/10" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-black/40 border border-white/10 p-6 rounded-3xl shadow-xl hover:border-primary/50 transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <span className={`material-symbols-outlined p-3 rounded-2xl ${stat.color}`}>{stat.icon}</span>
                            </div>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                            <h2 className="text-4xl font-black mt-2 text-white group-hover:text-primary transition-colors">{stat.value}</h2>
                        </div>
                    ))}
                </div>

                <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-black/40 border border-white/10 p-10 rounded-3xl h-80 flex flex-col items-center justify-center border-dashed">
                        <span className="material-symbols-outlined text-4xl text-slate-700 mb-4">analytics</span>
                        <p className="text-slate-500 font-bold italic">Revenue Trends Coming Soon</p>
                    </div>
                    <div className="bg-black/40 border border-white/10 p-10 rounded-3xl h-80 flex flex-col items-center justify-center border-dashed">
                        <span className="material-symbols-outlined text-4xl text-slate-700 mb-4">show_chart</span>
                        <p className="text-slate-500 font-bold italic">Attendance Distribution Coming Soon</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
