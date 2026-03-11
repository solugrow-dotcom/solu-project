"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function MemberPage() {
    const router = useRouter();
    const [members, setMembers] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
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
            fetchMembers(gymData.id);
        }
    }

    async function fetchMembers(id: string) {
        const { data } = await supabase
            .from("members")
            .select("*")
            .eq("gym_id", id)
            .order("created_at", { ascending: false });

        setMembers(data || []);
        setLoading(false);
    }

    async function addMember(e: React.FormEvent) {
        e.preventDefault();
        if (!gymId) return;

        const { error } = await supabase.from("members").insert({
            name,
            phone,
            email,
            gym_id: gymId
        });

        if (error) {
            alert(error.message);
        } else {
            alert("Member Added Successfully");
            setName("");
            setPhone("");
            setEmail("");
            fetchMembers(gymId);
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
                    <h1 className="text-4xl font-black text-slate-100 uppercase tracking-tighter">Member Directory</h1>
                    <p className="text-slate-400 font-medium">Manage your community and growth</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-1">
                        <form onSubmit={addMember} className="bg-black/40 p-8 rounded-3xl border border-white/10 space-y-4 sticky top-8 outline-dashed outline-1 outline-white/5">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">person_add</span>
                                Add New Member
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Full Name</label>
                                    <input
                                        required
                                        placeholder="e.g. Rahul Sharma"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full p-3 mt-1 rounded-xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Phone Number</label>
                                    <input
                                        required
                                        placeholder="e.g. 9876543210"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full p-3 mt-1 rounded-xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="e.g. rahul@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 mt-1 rounded-xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white p-4 rounded-xl font-black transition-all orange-glow mt-4 uppercase text-sm tracking-widest">
                                Register Member
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-black/40 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead className="bg-[#1a110a] border-b border-white/5">
                                    <tr>
                                        <th className="p-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Name</th>
                                        <th className="p-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Phone</th>
                                        <th className="p-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Plan</th>
                                        <th className="p-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((m) => (
                                        <tr key={m.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-5 font-bold text-slate-100">{m.name}</td>
                                            <td className="p-5 text-slate-400 font-medium">{m.phone}</td>
                                            <td className="p-5">
                                                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase border border-primary/20 tracking-tighter">
                                                    {m.plan || 'Free Trial'}
                                                </span>
                                            </td>
                                            <td className="p-5 text-slate-500 text-xs font-medium">
                                                {new Date(m.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {members.length === 0 && (
                                <div className="p-20 text-center flex flex-col items-center">
                                    <span className="material-symbols-outlined text-4xl text-slate-700 mb-4">person_off</span>
                                    <p className="text-slate-500 font-black italic uppercase text-xs tracking-widest">No members found in directory</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
