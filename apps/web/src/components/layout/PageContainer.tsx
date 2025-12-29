import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function PageContainer({
  children,
  title,
  description,
  actions,
  className,
  titleClassName,
  descriptionClassName,
}: PageContainerProps) {
  return (
    <div className={cn('flex-1', className)}>
      {/* 页面标题区域 */}
      {(title || description || actions) && (
        <div className="border-b bg-muted/30 dark:bg-gray-900/30 dark:border-gray-800">
          <div className="container max-w-7xl mx-auto px-8 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                {title && (
                  <h1 className={cn('text-2xl font-semibold tracking-tight', titleClassName)}>
                    {title}
                  </h1>
                )}
                {description && (
                  <p className={cn('text-sm text-muted-foreground', descriptionClassName)}>
                    {description}
                  </p>
                )}
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          </div>
        </div>
      )}

      {/* 页面内容 */}
      <div className="container max-w-7xl mx-auto px-8 py-6">{children}</div>
    </div>
  );
}
