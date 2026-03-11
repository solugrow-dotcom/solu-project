"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"

export default function TrainerDashboard() {
    const router = useRouter()
    const [stats, setStats] = useState({
        totalMembers: 0,
        dailySessions: 0,
        avgProgress: 0,
        activeTime: "0h"
    })
    const [members, setMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    async function fetchData() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/login")
                return
            }

            const { data: gymData } = await supabase
                .from("gyms")
                .select("id")
                .eq("owner_id", user.id)
                .single()

            if (!gymData) throw new Error("Gym not found")
            const gymId = gymData.id

            const today = new Date().toISOString().split("T")[0]

            // Fetch real data
            const [membersRes, attendanceRes, totalRes] = await Promise.all([
                supabase.from("members").select("*").eq("gym_id", gymId).order('created_at', { ascending: false }).limit(5),
                supabase.from("attendance").select("id", { count: 'exact' }).eq("gym_id", gymId).eq("date", today),
                supabase.from("members").select("id", { count: 'exact' }).eq("gym_id", gymId)
            ])

            setStats({
                totalMembers: totalRes.count || 0,
                dailySessions: attendanceRes.count || 0,
                avgProgress: 82, // Placeholder for calculated metric
                activeTime: "6.2h"
            })

            setMembers(membersRes.data || [])
        } catch (error) {
            console.error("Error fetching trainer data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) return <div className="min-h-screen bg-[#1a110a] flex items-center justify-center text-primary font-bold italic">Loading Pro Dashboard...</div>

    return (
        <div className="flex bg-[#1a110a]">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <header className="mb-10">
                    <h2 className="text-4xl font-black text-slate-100 uppercase tracking-tighter">Trainer Hub</h2>
                    <p className="text-slate-400 font-medium">Performance tracking and session management</p>
                </header>

                <div className="space-y-8">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { icon: "person", iconColor: "text-primary bg-primary/10", value: stats.totalMembers, label: "Assigned" },
                            { icon: "event_available", iconColor: "text-blue-500 bg-blue-500/10", value: stats.dailySessions, label: "Sessions" },
                            { icon: "speed", iconColor: "text-orange-500 bg-orange-500/10", value: stats.avgProgress + "%", label: "Efficiency" },
                            { icon: "timer", iconColor: "text-purple-500 bg-purple-500/10", value: stats.activeTime, label: "Uptime" },
                        ].map(({ icon, iconColor, value, label }) => (
                            <div key={label} className="bg-black/40 border border-white/10 p-6 rounded-3xl shadow-xl outline-dashed outline-1 outline-white/5">
                                <span className={`p-3 rounded-2xl material-symbols-outlined mb-4 ${iconColor}`}>{icon}</span>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{label}</p>
                                <h3 className="text-3xl font-black mt-2 text-white">{value}</h3>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-black/40 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-xl">
                                <h3 className="font-black text-slate-100 uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">diversity_3</span>
                                    Recent Assignments
                                </h3>
                                <div className="space-y-6">
                                    {members.map((m) => (
                                        <div key={m.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group">
                                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black border border-primary/20 shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                                {m.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-2">
                                                    <p className="font-black text-slate-100 uppercase tracking-tight">{m.name}</p>
                                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Active</p>
                                                </div>
                                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary rounded-full" style={{ width: `72%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {members.length === 0 && <p className="text-slate-500 italic text-center py-10 font-bold uppercase text-xs tracking-widest opacity-30">No active members found</p>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-black/40 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                                <h3 className="font-black text-slate-100 uppercase tracking-widest text-sm mb-6">Daily Insight</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                        <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-100 tracking-widest">Growth Trend</p>
                                            <p className="text-xs text-slate-400 mt-1">Gym scaling at +12% this week.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/40 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden min-h-[200px] flex flex-col justify-center border-dashed">
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-4xl text-slate-800 mb-2">equalizer</span>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Workload Analytics</p>
                                    <p className="text-[10px] text-slate-700 italic mt-1 font-bold">Calculation in progress...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

