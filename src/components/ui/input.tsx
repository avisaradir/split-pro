import * as React from 'react';

import { cn } from '~/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  rightIcon?: React.ReactNode;
};

// 17px text: matches iOS Body and keeps Safari from zooming on focus (< 16px triggers it).
const inputStyles =
  'border-input bg-card text-foreground placeholder:text-muted-foreground flex h-11 w-full rounded-lg border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-3 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50';

const Input: React.FC<InputProps> = ({ className, type, rightIcon, ...props }) => {
  return (
    <div className="relative w-full">
      <input type={type} data-slot="input" className={cn(inputStyles, className)} {...props} />
      {rightIcon && (
        <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">
          {rightIcon}
        </span>
      )}
    </div>
  );
};

Input.displayName = 'Input';

const MultilineInput: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className,
  rows = 3,
  ...props
}) => (
  <textarea
    data-slot="input"
    rows={rows}
    className={cn(inputStyles, 'h-auto resize-none', className)}
    {...props}
  />
);

export { Input, MultilineInput };
