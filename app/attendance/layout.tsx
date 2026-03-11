import SubscriptionGuard from "@/components/SubscriptionGuard";

export default function AttendanceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <SubscriptionGuard>{children}</SubscriptionGuard>;
}
