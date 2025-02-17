import { cn } from '@/src/utils/classnames';
import * as React from 'react';

export const sharedInputStyles =
  'w-full rounded-m border-0 bg-theme5 px-2xs py-3xs text-step-0 text-theme10 ring-offset-background placeholder:text-theme8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme9 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 file:border-0 file:bg-transparent file:text-sm file:font-medium',
          sharedInputStyles,
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
