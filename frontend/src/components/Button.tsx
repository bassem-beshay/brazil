import Link from 'next/link';
import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const baseClasses = [
  'inline-flex',
  'items-center',
  'justify-center',
  'gap-2',
  'rounded-xl',
  'font-semibold',
  'transition-all',
  'duration-200',
  'border',
  'cursor-pointer',
  'select-none',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-offset-2',
  'focus:ring-[#1B5E20]/20'
];

const variantClasses = {
  primary: 'bg-[#1B5E20] text-white border-[#1B5E20] hover:bg-[#2E7D32] hover:border-[#2E7D32]',
  secondary: 'bg-white text-[#263238] border-gray-200 hover:bg-gray-50 hover:border-gray-300',
  ghost: 'bg-transparent text-[#1B5E20] border-transparent hover:bg-[#1B5E20]/10'
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3.5 text-base'
};

export function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = [
    ...baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
