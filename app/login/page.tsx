"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (error: any) {
            alert(error.message || "Login Failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#23170f] text-slate-100 overflow-hidden font-display">
            {/* Background Accents */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

            <form onSubmit={handleLogin} className="relative z-10 bg-black/40 p-10 rounded-[2.5rem] w-full max-w-md space-y-8 border border-white/10 shadow-2xl backdrop-blur-xl outline-dashed outline-1 outline-white/5">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-3xl mb-6 orange-glow transform transition-transform hover:scale-110">
                        <span className="material-symbols-outlined text-4xl font-bold text-white">fitness_center</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase">Welcome Back</h2>
                    <p className="text-slate-400 mt-3 font-medium">Continue your gym management journey</p>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Email Identity</label>
                        <input
                            required
                            type="email"
                            placeholder="e.g. owner@gym.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Secret Key</label>
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all font-bold"
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-2">
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white p-5 rounded-2xl font-black transition-all orange-glow disabled:opacity-50 uppercase text-xs tracking-[0.2em] shadow-lg"
                    >
                        {loading ? "Verifying..." : "Initialize Session"}
                    </button>

                    <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Don&apos;t have an account? <a href="/signup" className="text-primary hover:underline">Register Gym</a>
                    </p>
                </div>
            </form>
        </div>
    );
}
