import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";
import { cn } from "@itell/utils";

export function CRIShell({
  children,
  className,
  ...rest
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card
      className={cn("border-info animate-in fade-in gap-4 py-3", className)}
      {...rest}
    >
      {children}
    </Card>
  );
}

export function CRIHeader({
  children,
  question,
  isOptional,
  className,
  headerRight,
  ...rest
}: {
  children?: React.ReactNode;
  question: string;
  isOptional?: boolean;
  headerRight?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <CardHeader className={cn("flex gap-1 py-1", className)} {...rest}>
      <CardTitle className="flex w-full items-baseline justify-between font-normal">
        <div>
          <p>
            <span className="font-bold">Question </span>
            {isOptional ? <span>(Optional)</span> : null}
          </p>
          <p className="leading-relaxed">{question}</p>
        </div>
        {headerRight}
      </CardTitle>
      {children}
    </CardHeader>
  );
}

export function CRIContent({
  children,
  className,
  ...rest
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <CardContent
      className={cn("flex flex-col gap-2 pb-6", className)}
      {...rest}
    >
      {children}
    </CardContent>
  );
}
