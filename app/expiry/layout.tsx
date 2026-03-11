import SubscriptionGuard from "@/components/SubscriptionGuard";

export default function ExpiryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <SubscriptionGuard>{children}</SubscriptionGuard>;
}
