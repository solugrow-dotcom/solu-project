"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AdminDashboard() {
    const router = useRouter();
    const [gymInfo, setGymInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [owner, setOwner] = useState("");
    const [phone, setPhone] = useState("");

    async function loadGym() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/login");
            return;
        }

        const { data, error } = await supabase
            .from("gyms")
            .select("*")
            .eq("owner_id", user.id)
            .single();

        if (data) {
            setGymInfo(data);
            setName(data.gym_name || "");
            setOwner(data.owner_name || "");
            setPhone(data.phone || "");
        }
        setLoading(false);
    }

    const updateGym = async (e: any) => {
        e.preventDefault();
        const { error } = await supabase
            .from("gyms")
            .update({
                gym_name: name,
                owner_name: owner,
                phone: phone
            })
            .eq("id", gymInfo.id);

        if (error) {
            alert(error.message);
        } else {
            alert("Settings Updated!");
            loadGym();
        }
    }

    useEffect(() => {
        loadGym();
    }, []);

    if (loading) return <div className="min-h-screen bg-[#1a110a] flex items-center justify-center text-primary font-bold">Loading Settings...</div>;

    return (
        <div className="flex bg-[#1a110a]">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-slate-100 uppercase tracking-tighter">Gym Settings</h1>
                    <p className="text-slate-400 font-medium">Configure your facility details and branding</p>
                </header>

                <div className="max-w-2xl">
                    <form onSubmit={updateGym} className="bg-black/40 p-10 rounded-[2.5rem] border border-white/10 space-y-8 outline-dashed outline-1 outline-white/5 shadow-2xl">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Business Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Iron Paradise Gym"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all font-bold text-slate-100"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Owner Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={owner}
                                        onChange={(e) => setOwner(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all font-bold text-slate-100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Official Contact</label>
                                    <input
                                        type="text"
                                        placeholder="Phone number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all font-bold text-slate-100"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white p-5 rounded-2xl font-black transition-all orange-glow uppercase text-xs tracking-[0.2em] shadow-lg flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">save</span>
                            Commit Changes
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}