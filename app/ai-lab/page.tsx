"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function AIGenerator() {
    const [type, setType] = useState<"workout" | "diet">("workout");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [goal, setGoal] = useState("");
    const [level, setLevel] = useState("beginner");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const generateAIPlan = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult("");

        try {
            const res = await fetch("/api/ai-generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type,
                    userData: { age, weight, goal, level }
                })
            });

            const data = await res.json();
            if (data.plan) {
                setResult(data.plan);
            } else {
                alert("Something went wrong");
            }
        } catch (error) {
            console.error(error);
            alert("Error generating plan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-[#1a110a]">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-slate-100 uppercase tracking-tighter">AI Fitness Lab</h1>
                    <p className="text-slate-400 font-medium tracking-tight">Generate personalized workout & diet protocols</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-black/40 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl outline-dashed outline-1 outline-white/5">
                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={() => setType("workout")}
                                className={`flex-1 p-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${type === 'workout' ? 'bg-primary text-white orange-glow' : 'bg-white/5 text-slate-500 border border-white/10'}`}
                            >
                                Workout Plan
                            </button>
                            <button
                                onClick={() => setType("diet")}
                                className={`flex-1 p-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${type === 'diet' ? 'bg-primary text-white orange-glow' : 'bg-white/5 text-slate-500 border border-white/10'}`}
                            >
                                Diet Plan
                            </button>
                        </div>

                        <form onSubmit={generateAIPlan} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Current Age</label>
                                    <input
                                        required
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none text-slate-100 font-bold"
                                        placeholder="e.g. 25"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Weight (KG)</label>
                                    <input
                                        required
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none text-slate-100 font-bold"
                                        placeholder="e.g. 70"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Primary Goal</label>
                                <input
                                    required
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none text-slate-100 font-bold"
                                    placeholder="e.g. Muscle Gain, Weight Loss"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Fitness Level</label>
                                <select
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                    className="w-full p-4 rounded-2xl bg-[#1a110a] border border-white/10 focus:border-primary outline-none text-slate-100 font-bold appearance-none"
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced (Alpha)</option>
                                </select>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-white p-5 rounded-2xl font-black transition-all orange-glow uppercase text-sm tracking-[0.2em] shadow-lg disabled:opacity-50"
                            >
                                {loading ? "Analyzing Bio-data..." : "Generate AI Protocol"}
                            </button>
                        </form>
                    </div>

                    <div className="bg-black/60 rounded-[2.5rem] border border-white/10 shadow-2xl p-10 overflow-y-auto max-h-[600px] prose prose-invert prose-orange">
                        {result ? (
                            <div className="whitespace-pre-wrap font-medium text-slate-300">
                                {result}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                <span className="material-symbols-outlined text-6xl mb-4">psychology</span>
                                <p className="font-black uppercase tracking-widest text-xs">AI Result will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
