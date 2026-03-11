"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function MembershipPage() {
    const router = useRouter();
    const [members, setMembers] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [selectedMember, setSelectedMember] = useState("");
    const [selectedPlan, setSelectedPlan] = useState("");
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
            const [mRes, pRes] = await Promise.all([
                supabase.from("members").select("id, name").eq("gym_id", gymData.id),
                supabase.from("plans").select("id, name").eq("gym_id", gymData.id)
            ]);
            setMembers(mRes.data || []);
            setPlans(pRes.data || []);
        }
        setLoading(false);
    }

    async function assignPlan(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedMember || !selectedPlan || !gymId) return;

        // In this architecture, we update the member's plan directly
        // This is a simplified version of 'assigning' a membership
        const { error } = await supabase
            .from("members")
            .update({
                plan: plans.find(p => p.id === selectedPlan)?.name
            })
            .eq("id", selectedMember);

        if (error) {
            alert("Error assigning membership: " + error.message);
        } else {
            alert("Membership Assigned Successfully");
            setSelectedMember("");
            setSelectedPlan("");
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
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-slate-100 uppercase tracking-tighter">Plan Delegation</h1>
                    <p className="text-slate-400 font-medium">Assign membership Tiers to registered members</p>
                </header>

                <div className="max-w-xl">
                    <form onSubmit={assignPlan} className="bg-black/40 p-10 rounded-[2.5rem] border border-white/10 space-y-8 outline-dashed outline-1 outline-white/5 shadow-2xl backdrop-blur-xl">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Target Member</label>
                                <select
                                    required
                                    value={selectedMember}
                                    onChange={(e) => setSelectedMember(e.target.value)}
                                    className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all font-bold text-slate-100 appearance-none"
                                >
                                    <option value="">Select Member</option>
                                    {members.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Assigned Tier</label>
                                <select
                                    required
                                    value={selectedPlan}
                                    onChange={(e) => setSelectedPlan(e.target.value)}
                                    className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all font-bold text-slate-100 appearance-none"
                                >
                                    <option value="">Select Plan</option>
                                    {plans.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white p-5 rounded-2xl font-black transition-all orange-glow uppercase text-xs tracking-[0.2em] shadow-lg flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">handshake</span>
                            Confirm Assignment
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}