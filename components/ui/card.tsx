import { cn } from "@/lib/utils";

export function Card({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("panel p-5", className)}>{children}</div>;
}

export function CardHeader({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        {description ? <p className="mt-1 text-sm text-forest-900/60">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
