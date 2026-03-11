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
                    {/* Revenue Trend Chart */}
                    <div className="bg-black/40 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl outline-dashed outline-1 outline-white/5">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-100 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
                                Revenue Velocity
                            </h3>
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest bg-white/5 px-3 py-1 rounded-full uppercase">Last 30 Days</span>
                        </div>
                        <div className="h-48 flex items-end gap-3 px-2">
                            {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <div 
                                        style={{ height: `${h}%` }} 
                                        className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-xl transition-all group-hover:from-primary/40 group-hover:scale-x-110 orange-glow-subtle"
                                    />
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h}%
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 px-2">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                                <span key={d} className="text-[10px] font-black text-slate-600">{d}</span>
                            ))}
                        </div>
                    </div>

                    {/* Attendance Heatmap / Circle */}
                    <div className="bg-black/40 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl outline-dashed outline-1 outline-white/5 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-100 mb-8 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500 text-sm">donut_large</span>
                                Occupancy Map
                            </h3>
                            <div className="flex items-center justify-center h-48">
                                <div className="relative w-40 h-40 rounded-full border-[12px] border-white/5 flex items-center justify-center group">
                                    <div className="absolute inset-0 rounded-full border-[12px] border-primary border-t-transparent -rotate-45" />
                                    <div className="text-center">
                                        <p className="text-4xl font-black text-white group-hover:text-primary transition-colors">74%</p>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">At Capacity</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Background Decoration */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full" />
                    </div>
                </div>
            </main>
        </div>
    )
}
