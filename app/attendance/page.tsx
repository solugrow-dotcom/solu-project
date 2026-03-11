"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function Attendance() {
    const router = useRouter();
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [gymId, setGymId] = useState<string | null>(null);

    async function initialize() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/login");
            return;
        }

        const { data: gymData } = await supabase
            .from("gyms")
            .select("id")
            .eq("owner_id", user.id)
            .single();

        if (gymData) {
            setGymId(gymData.id);
            loadMembers(gymData.id);
        } else {
            setLoading(false); // No gym found for the user
        }
    }

    async function loadMembers(id: string) {
        const { data } = await supabase
            .from("members")
            .select("*")
            .eq("gym_id", id);

        setMembers(data || []);
        setLoading(false);
    }

    async function markAttendance(memberId: string) {
        if (!gymId) return;

        const { error } = await supabase.from("attendance").insert({
            member_id: memberId,
            gym_id: gymId,
            date: new Date().toISOString().split("T")[0],
            status: 'present',
            check_in: new Date().toISOString()
        });

        if (error) {
            alert("Error: " + error.message);
        } else {
            alert("Attendance Logged");
        }
    }

    useEffect(() => {
        initialize();
    }, []);

    if (loading) return <div className="min-h-screen bg-[#1a110a] flex items-center justify-center text-primary font-bold">Loading...</div>;

    return (
        <div className="flex bg-[#1a110a]">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <header className="mb-10 text-center lg:text-left">
                    <h1 className="text-4xl font-black text-slate-100 uppercase tracking-tighter">Daily Check-In</h1>
                    <p className="text-slate-400 font-medium tracking-tight">Managing attendance for {new Date().toLocaleDateString()}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((m) => (
                        <div key={m.id} className="bg-black/40 border border-white/10 p-6 rounded-3xl flex items-center justify-between hover:border-primary/50 hover:bg-black/60 transition-all group group cursor-pointer shadow-lg outline-dashed outline-1 outline-white/5">
                            <div>
                                <h3 className="text-lg font-black group-hover:text-primary transition-colors tracking-tighter uppercase">{m.name}</h3>
                                <p className="text-slate-500 font-bold text-xs mt-1">{m.phone}</p>
                            </div>
                            <button
                                onClick={() => markAttendance(m.id)}
                                className="p-4 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all shadow-inner"
                                title="Mark Present"
                            >
                                <span className="material-symbols-outlined font-black">check_circle</span>
                            </button>
                        </div>
                    ))}
                </div>

                {members.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 bg-black/20 rounded-[3rem] border border-dashed border-white/5">
                        <span className="material-symbols-outlined text-6xl text-slate-700 mb-6">event_busy</span>
                        <p className="text-slate-500 italic text-xl font-black uppercase tracking-widest opacity-40">No members available for check-in</p>
                        <a href="/member" className="bg-white/5 border border-white/10 text-slate-300 font-black px-8 py-3 rounded-full mt-6 hover:bg-primary hover:text-white transition-all text-xs tracking-widest uppercase">Add Members Now</a>
                    </div>
                )}
            </main>
        </div>
    );
}