import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary';

const base =
  'inline-flex items-center justify-center gap-2 rounded-[4px] border font-button px-[22px] py-[11px] text-sm font-medium leading-[1.4] transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-blue-700 text-white hover:bg-ink-900',
  secondary: 'border-transparent bg-ink-50 text-ink-900 hover:border-line-strong',
};

const disabledClasses = 'border-transparent bg-ink-50 text-ink-400 cursor-not-allowed';

// Use this to style a Link the same way as a Button.
export function buttonClassNames(variant: ButtonVariant = 'primary', isDisabled = false): string {
  return isDisabled ? `${base} ${disabledClasses}` : `${base} ${variantClasses[variant]}`;
}

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  variant?: ButtonVariant;
  isDisabled?: boolean;
  children: ReactNode;
}

// A screen reader skips a native `disabled` control. This button stays in the
// tab order and uses `aria-disabled` instead, so a disabled state is still
// announced. See BUILD_SPEC.md, Section 3.8.
export function Button({
  variant = 'primary',
  isDisabled = false,
  className = '',
  onClick,
  children,
  ...rest
}: ButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  return (
    <button
      type="button"
      className={`${buttonClassNames(variant, isDisabled)} ${className}`}
      aria-disabled={isDisabled || undefined}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}
