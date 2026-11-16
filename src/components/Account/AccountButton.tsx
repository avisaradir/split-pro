import React from 'react';
import { Button, type ButtonProps } from '../ui/button';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '~/lib/utils';

export const AccountButton: React.FC<React.PropsWithChildren<ButtonProps> & { href?: string }> = ({
  children,
  href,
  className,
  ...buttonProps
}) => (
  <WithLink href={href}>
    <Button
      variant="ghost"
      // Row styles come last so drawer/dialog trigger classes can't re-center the row.
      className={cn(
        className,
        'bg-card hover:bg-muted active:bg-muted h-auto min-h-11 w-full justify-between gap-3 rounded-none px-4 py-2 text-base font-normal hover:opacity-100 active:opacity-100',
      )}
      {...buttonProps}
    >
      <div className="flex min-w-0 items-center gap-3 text-start whitespace-normal">{children}</div>
      <ChevronRight
        className="text-tertiary-foreground size-5 shrink-0 rtl:-scale-x-100"
        aria-hidden="true"
      />
    </Button>
  </WithLink>
);

/** A Settings-style icon tile: white glyph on a colored rounded square. */
export const AccountIcon: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  className,
  children,
}) => (
  <span
    aria-hidden="true"
    className={cn(
      'flex size-7 shrink-0 items-center justify-center rounded-md text-white [&_svg]:size-[18px]',
      className,
    )}
  >
    {children}
  </span>
);

export const WithLink: React.FC<React.PropsWithChildren<{ href?: string }>> = ({
  href,
  children,
}) =>
  href ? (
    <Link href={href} target={href.startsWith('http') ? '_blank' : undefined}>
      {children}
    </Link>
  ) : (
    children
  );
