import * as React from 'react';

import { cn } from '~/lib/utils';

/**
 * An inset grouped list (iOS Settings style): rows sit on a rounded card on the grouped
 * background, separated by hairlines — color.md › Mobile, layout.md › Visual hierarchy.
 */
export const ListGroup: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  className,
  children,
}) => (
  <div className={cn('bg-card divide-separator divide-y overflow-hidden rounded-xl', className)}>
    {children}
  </div>
);
