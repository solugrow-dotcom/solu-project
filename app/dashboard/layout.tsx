import SubscriptionGuard from "@/components/SubscriptionGuard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <SubscriptionGuard>{children}</SubscriptionGuard>;
}
