import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { motion, HTMLMotionProps } from 'framer-motion';

const Card = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
    ({ className, ...props }, ref) => (
        <motion.div
            ref={ref}
            className={cn(
                'rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden',
                className
            )}
            {...props}
        />
    )
);
Card.displayName = 'Card';

export { Card };
