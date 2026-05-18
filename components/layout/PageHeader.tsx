import { Badge } from "@/components/ui/badge";

export function PageHeader({
  title,
  description,
  eyebrow,
  action
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-forest-900/10 bg-white/70 px-5 py-5 md:flex-row md:items-end md:justify-between md:px-6">
      <div>
        {eyebrow ? (
          <Badge className="mb-3 bg-forest-100 text-forest-800">
            {eyebrow}
          </Badge>
        ) : null}
        <h1 className="text-3xl md:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm text-forest-900/65 md:text-base">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
