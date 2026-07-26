"use client";
import React from "react";
export function PatinaProvider({ score, children }: { score: number, children: React.ReactNode }) {
  return (
    <div 
      className="contents" 
      style={{ '--patina-global-age': score } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
