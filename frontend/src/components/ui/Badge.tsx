import React from "react";

export const Badge: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
  <span className={"inline-block rounded-full bg-purple-600 text-white px-2 py-0.5 text-xs font-bold " + className}>{children}</span>
); 