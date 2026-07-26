'use client';
import React from 'react';
import Link, { LinkProps } from 'next/link';

import { useTransitionContext } from './TransitionContext';
interface ArchivalLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, LinkProps {
  children: React.ReactNode;
  className?: string;
  href: string;
}
export function ArchivalLink({ children, href, className, onClick, prefetch = true, ...props }: ArchivalLinkProps) {

  const transition = useTransitionContext();
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
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
      prefetch={prefetch} 
      {...props}
    >
      {children}
    </Link>
  );
}
