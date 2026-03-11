import SubscriptionGuard from "@/components/SubscriptionGuard";

export default function MembershipLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <SubscriptionGuard>{children}</SubscriptionGuard>;
}
