import SubscriptionGuard from "@/components/SubscriptionGuard";

export default function PaymentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <SubscriptionGuard>{children}</SubscriptionGuard>;
}
