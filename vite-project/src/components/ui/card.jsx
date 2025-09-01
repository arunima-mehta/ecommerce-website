import React from 'react';
import { cn } from "../../lib/utils";

const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card };