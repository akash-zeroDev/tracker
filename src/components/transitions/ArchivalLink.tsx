'use client';

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransitionContext } from './TransitionContext';

interface ArchivalLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, LinkProps {
  children: React.ReactNode;
  className?: string;
  href: string;
}

export function ArchivalLink({ children, href, className, onClick, prefetch = true, ...props }: ArchivalLinkProps) {
  const router = useRouter();
  const transition = useTransitionContext();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let browser handle new tabs/windows natively
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    // Call any custom onClick passed in
    if (onClick) {
      onClick(e);
    }

    e.preventDefault();
    transition.navigate(href);
  };

  return (
    <Link 
      href={href} 
      className={className} 
      onClick={handleClick} 
      prefetch={prefetch} // Aggressive prefetch enabled by default
      {...props}
    >
      {children}
    </Link>
  );
}
