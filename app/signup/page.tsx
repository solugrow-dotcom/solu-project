"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Signup() {
    const router = useRouter();
    const [gym, setGym] = useState("");
    const [owner, setOwner] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [plan, setPlan] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create Auth User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Create Gym Record linked to User
                const { error: gymError } = await supabase
                    .from("gyms")
                    .insert([
                        {
                            gym_name: gym,
                            owner_name: owner,
                            email: email,
                            phone: phone,
                            plan: plan,
                            owner_id: authData.user.id
                        }
                    ]);

                if (gymError) throw gymError;

                alert("Account established! Please check your email for verification.");
                router.push("/login");
            }
        } catch (error: any) {
            alert(error.message || "Signup Failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#23170f] text-slate-100 overflow-hidden font-display p-4">
            {/* Background Accents */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

            <form onSubmit={handleSignup} className="relative z-10 bg-black/40 p-10 rounded-[2.5rem] w-full max-w-lg space-y-6 border border-white/10 shadow-2xl backdrop-blur-xl outline-dashed outline-1 outline-white/5 mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tighter uppercase text-white mb-2">Gym Registration</h1>
                    <p className="text-slate-400 font-medium tracking-tight">Join the elite network of modern fitness centers</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Business Entity</label>
                        <input
                            required
                            className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all font-bold tracking-tight"
                            placeholder="Gym Name"
                            onChange={(e) => setGym(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Authorized Owner</label>
                        <input
                            required
                            className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all font-bold tracking-tight"
                            placeholder="Full Name"
                            onChange={(e) => setOwner(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Login Email</label>
                        <input
                            required
                            type="email"
                            className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all font-bold tracking-tight"
                            placeholder="owner@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Access Key</label>
                        <input
                            required
                            type="password"
                            className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all font-bold tracking-tight"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Contact Channel</label>
                        <input
                            className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all font-bold tracking-tight"
                            placeholder="Phone Number"
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Service Tier</label>
                        <select
                            required
                            className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all font-bold appearance-none text-slate-300"
                            onChange={(e) => setPlan(e.target.value)}
                        >
                            <option value="">Select Tier</option>
                            <option value="999">Essential - ₹999</option>
                            <option value="1999">Professional - ₹1999</option>
                            <option value="2999">Ultimate - ₹2999</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4 space-y-4">
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white p-5 rounded-2xl font-black transition-all orange-glow disabled:opacity-50 uppercase text-xs tracking-[0.2em] shadow-lg"
                    >
                        {loading ? "Establishing Protocol..." : "Confirm Membership"}
                    </button>

                    <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Already authenticated? <a href="/login" className="text-primary hover:underline">Sign In</a>
                    </p>
                </div>
            </form>
        </div>
    );
}