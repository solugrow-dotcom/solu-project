"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Script from "next/script";

export default function PlansPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("");
    const [plans, setPlans] = useState<any[]>([]);
    const [gymData, setGymData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);

    async function initialize() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/login");
            return;
        }

        const { data: gym } = await supabase
            .from("gyms")
            .select("*")
            .eq("owner_id", user.id)
            .single();

        if (gym) {
            setGymData(gym);
            fetchPlans(gym.id);
        } else {
            setLoading(false);
        }
    }

    async function fetchPlans(id: string) {
        const { data } = await supabase
            .from("plans")
            .select("*")
            .eq("gym_id", id);
        setPlans(data || []);
        setLoading(false);
    }

    const createPlan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gymData?.id) return;

        const { error } = await supabase
            .from("plans")
            .insert({
                name,
                price: parseFloat(price),
                duration_days: parseInt(duration),
                gym_id: gymData.id
            });

        if (error) {
            alert(error.message);
        } else {
            alert("Plan Created Successfully");
            setName("");
            setPrice("");
            setDuration("");
            fetchPlans(gymData.id);
        }
    }

    const handleSaaSSubscription = async (planName: string, amount: number) => {
        if (!gymData?.id) return;
        setProcessingPayment(true);

        try {
            const res = await fetch("/api/create-order", {
                method: "POST",
                body: JSON.stringify({ amount }),
            });
            const order = await res.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                name: "SoluGrow Gym SaaS",
                description: `${planName} Subscription`,
                order_id: order.id,
                handler: async function (response: any) {
                    const verifyRes = await fetch("/api/verify-payment", {
                        method: "POST",
                        body: JSON.stringify({
                            ...response,
                            planName,
                            gymId: gymData.id
                        }),
                    });
                    const result = await verifyRes.json();
                    if (result.success) {
                        alert("Subscription Activated Successfully!");
                        window.location.reload();
                    } else {
                        alert("Verification Failed: " + result.error);
                    }
                },
                prefill: {
                    name: gymData.owner_name,
                    email: gymData.email,
                    contact: gymData.phone,
                },
                theme: {
                    color: "#F97316",
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment initialization failed");
        } finally {
            setProcessingPayment(false);
        }
    };

    useEffect(() => {
        initialize();
    }, []);

    if (loading) return <div className="min-h-screen bg-[#1a110a] flex items-center justify-center text-primary font-bold">Loading...</div>;

    return (
        <div className="flex bg-[#1a110a]">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <Sidebar />
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <header className="mb-10 lg:flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-slate-100 uppercase tracking-tighter">SaaS & Products</h1>
                        <p className="text-slate-400 font-medium">Manage your subscription and gym plans</p>
                    </div>
                </header>

                {/* SaaS Subscription Section */}
                <section className="mb-16">
                    <h2 className="text-xl font-black uppercase tracking-widest text-primary mb-6">Upgrade Your SaaS Plan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: "Basic", price: 999, features: ["Up to 100 Members", "Basic Reports", "Support"] },
                            { name: "Pro", price: 1999, features: ["Unlimited Members", "Advanced Analytics", "Priority Support"] },
                            { name: "Premium", price: 2999, features: ["Everything in Pro", "AI Workout Generator", "White Labeling"] },
                        ].map((pkg) => (
                            <div key={pkg.name} className={`bg-black/40 border ${gymData?.subscription_plan === pkg.name.toLowerCase() ? 'border-primary' : 'border-white/10'} p-8 rounded-[2rem] flex flex-col justify-between hover:border-primary/50 transition-all group`}>
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{pkg.name}</h3>
                                        {gymData?.subscription_plan === pkg.name.toLowerCase() && (
                                            <span className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded-md uppercase">Active</span>
                                        )}
                                    </div>
                                    <p className="text-4xl font-black text-primary mt-4">₹{pkg.price}<span className="text-xs text-slate-500 font-bold">/mo</span></p>
                                    <ul className="mt-6 space-y-3">
                                        {pkg.features.map(f => (
                                            <li key={f} className="text-slate-400 text-sm flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button
                                    onClick={() => handleSaaSSubscription(pkg.name, pkg.price)}
                                    disabled={processingPayment || gymData?.subscription_plan === pkg.name.toLowerCase()}
                                    className="mt-8 w-full bg-primary hover:bg-primary/90 text-white p-4 rounded-xl font-black transition-all uppercase text-xs tracking-widest disabled:opacity-50"
                                >
                                    {gymData?.subscription_plan === pkg.name.toLowerCase() ? "Current Plan" : "Select Plan"}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 border-t border-white/10 pt-10">
                    <div className="lg:col-span-1">
                        <form onSubmit={createPlan} className="bg-black/40 p-8 rounded-3xl border border-white/10 space-y-6 outline-dashed outline-1 outline-white/5">
                            <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">add_box</span>
                                Create Gym Plan
                            </h2>
                            <div className="space-y-4">
                                <input
                                    required
                                    placeholder="Tier Name (e.g. Platinum)"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-4 rounded-xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all font-bold"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        required
                                        type="number"
                                        placeholder="Price (₹)"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full p-4 rounded-xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all font-bold text-primary"
                                    />
                                    <input
                                        required
                                        type="number"
                                        placeholder="Days"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full p-4 rounded-xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none transition-all font-bold"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white p-5 rounded-2xl font-black transition-all orange-glow shadow-lg uppercase text-xs tracking-[0.2em]">
                                Publish Plan
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {plans.map((p) => (
                            <div key={p.id} className="bg-black/40 border border-white/10 p-8 rounded-[2rem] flex flex-col justify-between hover:border-primary transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-6xl font-black text-primary">verified</span>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black text-slate-100 uppercase tracking-tighter">{p.name}</h3>
                                    <div className="mt-6 flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-primary tracking-tighter">₹{p.price}</span>
                                        <span className="text-slate-500 text-xs font-black uppercase tracking-widest">/ {p.duration_days} Days</span>
                                    </div>
                                </div>
                                <button className="mt-8 text-slate-600 font-black text-[10px] uppercase hover:text-red-500 transition-colors flex items-center gap-1 tracking-widest relative z-10">
                                    <span className="material-symbols-outlined text-sm">block</span>
                                    Archive Tier
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
