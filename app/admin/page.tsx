import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";

const adminCards = [
  {
    href: "/admin/users",
    title: "Users",
    description: "Manage employee and administrator accounts stored in users.csv."
  },
  {
    href: "/admin/data",
    title: "Data Manager",
    description: "Preview CSV uploads and inspect file-record data sources."
  },
  {
    href: "/admin/settings",
    title: "Settings",
    description: "Adjust LLM availability status and performance thresholds."
  }
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="Admin Control Panel"
        description="Manage identities, file data, and system settings for the Forest eOffice monitoring workspace."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="h-full bg-white/90 transition hover:-translate-y-1 hover:border-forest-500/20">
              <h3 className="text-2xl font-semibold">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-forest-900/65">{card.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
