"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter, usePathname } from "next/navigation"

export default function SubscriptionGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isActive, setIsActive] = useState<boolean | null>(null)

    useEffect(() => {
        async function checkSubscription() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: gym } = await supabase
                .from("gyms")
                .select("subscription_status, expires_at")
                .eq("owner_id", user.id)
                .single()

            if (!gym) {
                setIsActive(true) // No gym record yet (maybe signup in progress)
                return
            }

            const expiryDate = gym.expires_at ? new Date(gym.expires_at) : null
            const now = new Date()

            if (gym.subscription_status === "expired" || (expiryDate && expiryDate < now)) {
                // Only redirect if not already on plans page or home
                if (pathname !== "/plans" && pathname !== "/" && pathname !== "/login") {
                    setIsActive(false)
                    router.push("/plans?error=expired")
                } else {
                    setIsActive(true)
                }
            } else {
                setIsActive(true)
            }
        }

        checkSubscription()
    }, [pathname, router])

    if (isActive === null) {
        return (
            <div className="min-h-screen bg-[#1a110a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Verifying Access...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
