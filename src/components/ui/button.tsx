import { type VariantProps, cva } from 'class-variance-authority';
import { Slot as SlotPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '~/lib/utils';

import { LoadingSpinner } from './spinner';

// Sizes follow the 44×44 pt default hit region (buttons.md › Best practices). `sm` keeps a
// compact 36px bezel but extends its hit region to 44px with an invisible pseudo-element.
const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-semibold transition-[background-color,opacity,color] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:opacity-70 disabled:pointer-events-none disabled:opacity-35',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-card hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'min-w-11 p-0 font-medium hover:opacity-70',
        link: 'text-primary font-medium underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-4',
        sm: 'h-9 px-3 text-sm after:absolute after:inset-x-0 after:-inset-y-1 after:content-[""]',
        lg: 'h-12 px-8',
        icon: 'size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  responsiveIcon?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'default',
      size,
      asChild = false,
      responsiveIcon = false,
      children,
      loading,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? SlotPrimitive.Slot : 'button';
    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            className: cn(
              className,
              responsiveIcon
                ? 'responsive-icon xs:gap-1 xs:text-sm xs:w-40 w-auto lg:w-[180px]'
                : '',
            ),
          }),
        )}
        ref={ref}
        {...props}
      >
        {loading ? <LoadingSpinner /> : children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
