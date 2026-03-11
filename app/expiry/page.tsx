"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function Expiry() {
    const router = useRouter();
    const [expired, setExpired] = useState<any[]>([]);
    const [expiring, setExpiring] = useState<any[]>([]);
    const [gymId, setGymId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

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
            load(gymData.id);
        }
    }

    async function load(id: string) {
        const today = new Date().toISOString().split("T")[0];

        // Expired members
        const { data: expiredMembers } = await supabase
            .from("members")
            .select("*")
            .eq("gym_id", id)
            .lt("membership_end", today);

        setExpired(expiredMembers || []);

        // Expiring soon (next 3 days)
        const future = new Date();
        future.setDate(future.getDate() + 3);
        const futureDate = future.toISOString().split("T")[0];

        const { data: expiringMembers } = await supabase
            .from("members")
            .select("*")
            .eq("gym_id", id)
            .gte("membership_end", today)
            .lte("membership_end", futureDate);

        setExpiring(expiringMembers || []);
        setLoading(false);
    }

    async function renewMembership(member: any) {
        if (!gymId) return;

        const endDate = new Date(member.membership_end || new Date());
        endDate.setDate(endDate.getDate() + 30);
        const newDate = endDate.toISOString().split("T")[0];

        const { error } = await supabase
            .from("members")
            .update({ membership_end: newDate })
            .eq("id", member.id);

        if (error) {
            alert("Error renewing membership: " + error.message);
        } else {
            alert("Membership Renewed Successfully");
            load(gymId);
        }
    }

    useEffect(() => {
        initialize();
    }, [])

    if (loading) return <div className="min-h-screen bg-[#1a110a] flex items-center justify-center text-primary font-bold">Checking alerts...</div>;

    return (
        <div className="flex bg-[#1a110a]">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-slate-100 uppercase tracking-tighter">Retention Radar</h1>
                    <p className="text-slate-400 font-medium">Manage renewals and prevent churn</p>
                </header>

                <div className="space-y-12">
                    {/* Expired Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-6 text-red-500">
                            <span className="material-symbols-outlined font-black">error</span>
                            <h2 className="text-2xl font-black uppercase tracking-tight">Expired Members ({expired.length})</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {expired.map((m) => (
                                <div key={m.id} className="bg-red-500/5 border border-red-500/10 p-8 rounded-[2rem] flex flex-col justify-between hover:border-red-500/40 transition-all group">
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{m.name}</h3>
                                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Lapsed Member</span>
                                        </div>
                                        <p className="text-slate-500 text-xs font-bold mt-6 uppercase tracking-widest">Expired Date</p>
                                        <p className="text-red-400 font-black text-lg">{new Date(m.membership_end).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        onClick={() => renewMembership(m)}
                                        className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-2xl font-black transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">reiterate</span>
                                        Process Renewal
                                    </button>
                                </div>
                            ))}
                        </div>
                        {expired.length === 0 && (
                            <div className="bg-black/20 border border-white/5 p-10 rounded-3xl text-center">
                                <p className="text-slate-500 font-black italic uppercase text-xs tracking-[0.2em]">Zero churn detected. All clear.</p>
                            </div>
                        )}
                    </section>

                    {/* Expiring Soon Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <span className="material-symbols-outlined font-black">notification_important</span>
                            <h2 className="text-2xl font-black uppercase tracking-tight">Critical Window ({expiring.length})</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {expiring.map((m) => (
                                <div key={m.id} className="bg-primary/5 border border-primary/10 p-8 rounded-[2rem] flex flex-col justify-between hover:border-primary/40 transition-all group">
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{m.name}</h3>
                                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">3-Day Window</span>
                                        </div>
                                        <p className="text-slate-500 text-xs font-bold mt-6 uppercase tracking-widest">Expiry Date</p>
                                        <p className="text-primary font-black text-lg">{new Date(m.membership_end).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        onClick={() => renewMembership(m)}
                                        className="mt-8 w-full bg-primary hover:bg-primary/90 text-white p-4 rounded-2xl font-black transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 orange-glow"
                                    >
                                        <span className="material-symbols-outlined text-sm">bolt</span>
                                        Quick Renew
                                    </button>
                                </div>
                            ))}
                        </div>
                        {expiring.length === 0 && (
                            <div className="bg-black/20 border border-white/5 p-10 rounded-3xl text-center">
                                <p className="text-slate-500 font-black italic uppercase text-xs tracking-[0.2em]">No imminent expiries found.</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
