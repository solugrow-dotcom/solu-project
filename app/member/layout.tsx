import SubscriptionGuard from "@/components/SubscriptionGuard";

export default function MemberLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <SubscriptionGuard>{children}</SubscriptionGuard>;
}
