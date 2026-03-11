import SubscriptionGuard from "@/components/SubscriptionGuard";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <SubscriptionGuard>{children}</SubscriptionGuard>;
}
