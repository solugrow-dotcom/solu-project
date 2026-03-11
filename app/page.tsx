export default function LandingPage() {
    return (
        <div className="relative min-h-screen flex flex-col bg-[#f8f7f5] dark:bg-[#23170f] font-display text-slate-900 dark:text-slate-100 overflow-x-hidden">
            {/* Background Accents */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
            </div>

            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full glass border-b border-primary/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary rounded-lg text-white">
                                <span className="material-symbols-outlined text-2xl">fitness_center</span>
                            </div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">SoluGrow</h2>
                        </div>
                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
                            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Services</a>
                            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
                            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
                        </nav>
                        <div className="flex items-center gap-4">
                            <a href="/login" className="hidden lg:block text-sm font-bold hover:text-primary">Login</a>
                            <a href="/signup" className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all orange-glow">
                                Start Free Trial
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                                </span>
                                NEW: AI-POWERED RETENTION TOOLS
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight mb-6 dark:text-white">
                                Powerful Gym Management CRM Built For{" "}
                                <span className="text-primary">Modern Fitness</span> Businesses
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0">
                                Manage members, attendance, payments, trainers and analytics from one powerful platform designed for gyms.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <a href="/signup" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-lg orange-glow hover:scale-105 transition-transform">
                                    Start Free Trial
                                </a>
                                <button className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white font-bold rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors inline-flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">play_circle</span>
                                    Book Demo
                                </button>
                            </div>
                        </div>

                        {/* Hero Mock Dashboard */}
                        <div className="flex-1 relative">
                            <div className="relative z-10 rounded-2xl border border-primary/20 p-2 glass orange-glow">
                                <div className="rounded-xl overflow-hidden bg-slate-900 aspect-[16/10] relative">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-80"
                                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC4ehEUFsUDleol6Jz6V4EqB4khoWzxD7ROIwmp-QR-VgKjAjIl1bIOsn8RVj6eWXEmeyip52H9M0o7XEZIadv2NeIwqaokrv6UbiI2VZOROrqdiBMVykyKWCFQUQwqTxqJVuCVVpZFPb4zijG1OjSdsXjNVqd94maw5NQpIqceOe6QvmL1YkzVoCdCVKUrvdBvxlDm7I5UWISI5zz9bwYCKnPQd3wBGqogU91B2OM-0k4jU5Si48ZBvn3CIemWcJBfPifQKY3ZrbQ')" }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-[85%] h-[80%] glass rounded-lg border border-white/10 shadow-2xl overflow-hidden flex flex-col">
                                            <div className="h-8 bg-black/40 border-b border-white/10 flex items-center px-3 gap-1">
                                                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                            </div>
                                            <div className="flex-1 p-4 bg-[#23170f]/80 flex flex-col gap-4">
                                                <div className="flex gap-4">
                                                    <div className="flex-1 h-20 bg-primary/10 rounded border border-primary/20 flex items-end p-2 gap-1">
                                                        <div className="w-2 h-1/2 bg-primary" />
                                                        <div className="w-2 h-3/4 bg-primary" />
                                                        <div className="w-2 h-1/4 bg-primary" />
                                                        <div className="w-2 h-full bg-primary" />
                                                    </div>
                                                    <div className="flex-1 h-20 bg-primary/10 rounded border border-primary/20" />
                                                </div>
                                                <div className="flex-1 bg-slate-800/50 rounded p-3">
                                                    <div className="w-1/2 h-4 bg-slate-700 rounded mb-4" />
                                                    <div className="space-y-2">
                                                        <div className="w-full h-2 bg-slate-700/50 rounded" />
                                                        <div className="w-full h-2 bg-slate-700/50 rounded" />
                                                        <div className="w-3/4 h-2 bg-slate-700/50 rounded" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted Logos */}
            <section className="py-12 border-y border-primary/10 glass">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="text-center text-sm font-bold uppercase tracking-widest text-primary mb-8">Trusted by Industry Leaders</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
                        {[
                            { icon: "payments", label: "UPI" },
                            { icon: "account_balance_wallet", label: "Razorpay" },
                            { icon: "credit_card", label: "Stripe" },
                            { icon: "chat", label: "WhatsApp" },
                            { icon: "cloud", label: "Google" },
                        ].map(({ icon, label }) => (
                            <div key={label} className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-3xl">{icon}</span>
                                <span className="font-bold text-xl">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4 dark:text-white">Everything You Need To Grow</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Modern tools designed with glassmorphism and glowing accents to help your gym business scale effortlessly.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: "group", title: "Member Management", desc: "Easily organize and track your member database. Keep track of medical records, preferences, and personal goals." },
                            { icon: "calendar_month", title: "Attendance Tracking", desc: "Monitor check-ins and session attendance in real-time. Use QR codes or biometric integration for seamless entry." },
                            { icon: "sports_gymnastics", title: "Trainer Management", desc: "Assign trainers and manage schedules seamlessly. Track performance metrics and commission payouts automatically." },
                            { icon: "receipt_long", title: "Subscription Billing", desc: "Automated invoicing and secure payment processing. Handle recurring billing, renewals, and missed payments with ease." },
                            { icon: "query_stats", title: "Analytics Dashboard", desc: "In-depth insights into your gym's performance. Monitor churn rate, peak hours, and revenue growth in real-time." },
                            { icon: "smartphone", title: "Mobile Access", desc: "Manage your business on the go with our mobile app. Both members and staff get dedicated interfaces for mobility." },
                        ].map(({ icon, title, desc }) => (
                            <div key={title} className="group p-8 rounded-2xl glass border border-primary/10 hover:border-primary/40 transition-all hover:-translate-y-2 orange-glow">
                                <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl">{icon}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 dark:text-white">{title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto py-12 border-t border-primary/10 glass">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-primary rounded text-white scale-75">
                                <span className="material-symbols-outlined text-xl">fitness_center</span>
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white">SoluGrow</h2>
                        </div>
                        <div className="flex gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <a href="#" className="hover:text-primary">Privacy Policy</a>
                            <a href="#" className="hover:text-primary">Terms of Service</a>
                            <a href="#" className="hover:text-primary">Help Center</a>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">© 2024 SoluGrow CRM. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}