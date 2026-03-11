import SubscriptionGuard from "@/components/SubscriptionGuard";

export default function TrainerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <SubscriptionGuard>{children}</SubscriptionGuard>;
}
