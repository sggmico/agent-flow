import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  headerInnerClassName?: string;
  contentClassName?: string;
  contentInnerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function PageContainer({
  children,
  title,
  description,
  actions,
  className,
  headerClassName,
  headerInnerClassName,
  contentClassName,
  contentInnerClassName,
  titleClassName,
  descriptionClassName,
}: PageContainerProps) {
  return (
    <div className={cn('flex-1', className)}>
      {/* 页面标题区域 */}
      {(title || description || actions) && (
        <div
          className={cn(
            'border-b border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.55)]',
            headerClassName,
          )}
        >
          <div className={cn('container max-w-7xl mx-auto px-8 py-6', headerInnerClassName)}>
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
      <div className={cn('container max-w-7xl mx-auto px-8 py-6', contentClassName)}>
        <div className={cn(contentInnerClassName)}>{children}</div>
      </div>
    </div>
  );
}
