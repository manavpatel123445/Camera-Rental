import React from "react";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  (props, ref) => (
    <textarea
      ref={ref}
      className={"rounded-md border border-slate-600 bg-slate-700 text-white p-2 focus:outline-none focus:ring-2 focus:ring-purple-600 " + (props.className || "")}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea"; 