"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function Payments() {
    const router = useRouter();
    const [members, setMembers] = useState<any[]>([]);
    const [member, setMember] = useState("");
    const [amount, setAmount] = useState("");
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
            loadMembers(gymData.id);
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

    async function addPayment(e: React.FormEvent) {
        e.preventDefault();
        if (!gymId || !member || !amount) {
            alert("Please fill all fields");
            return;
        }

        const { error } = await supabase
            .from("payments")
            .insert({
                member_id: member,
                gym_id: gymId,
                amount: parseFloat(amount),
                date: new Date().toISOString().split("T")[0]
            });

        if (error) {
            alert("Error saving payment: " + error.message);
        } else {
            alert("Payment Recorded Successfully");
            setAmount("");
            setMember("");
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
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-slate-100 uppercase tracking-tighter">Finance Hub</h1>
                    <p className="text-slate-400 font-medium italic">Track every rupee, secure your growth</p>
                </header>

                <div className="max-w-xl mx-auto">
                    <form onSubmit={addPayment} className="bg-black/40 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8 outline-dashed outline-1 outline-white/5">
                        <div className="text-center group">
                            <div className="inline-flex p-5 rounded-3xl bg-primary/10 text-primary mb-3 shadow-inner group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-4xl font-black">currency_rupee</span>
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Record Transaction</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Select Payer</label>
                                <select
                                    required
                                    value={member}
                                    onChange={(e) => setMember(e.target.value)}
                                    className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all font-bold text-slate-300"
                                >
                                    <option value="">Search member...</option>
                                    {members.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.name} • {m.phone}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Amount (INR)</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all font-black text-2xl text-primary placeholder:text-slate-800"
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white p-5 rounded-2xl font-black transition-all orange-glow flex items-center justify-center gap-2 uppercase text-sm tracking-widest">
                            <span className="material-symbols-outlined font-black">bolt</span>
                            Execute Payment
                        </button>

                        <div className="flex items-center justify-center gap-2 text-slate-600">
                            <span className="material-symbols-outlined text-sm">verified_user</span>
                            <p className="text-[10px] uppercase font-bold tracking-tighter text-center">End-to-end encrypted ledger entry</p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}