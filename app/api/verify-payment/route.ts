import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            planName,
            gymId
        } = await req.json()

        // 1. Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET!)
            .update(body.toString())
            .digest("hex")

        const isSignatureValid = expectedSignature === razorpay_signature

        if (!isSignatureValid) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
        }

        // 2. Update Supabase
        const cookieStore = cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                },
            }
        )

        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 30)

        const { error } = await supabase
            .from("gyms")
            .update({
                subscription_plan: planName.toLowerCase(),
                subscription_status: "active",
                expires_at: expiresAt.toISOString()
            })
            .eq("id", gymId)

        if (error) throw error

        // 3. Record Payment
        await supabase.from("payments").insert({
            gym_id: gymId,
            amount: planName === "Basic" ? 999 : planName === "Pro" ? 1999 : 2999,
            method: "razorpay",
            date: new Date().toISOString().split("T")[0]
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Payment Verification Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
