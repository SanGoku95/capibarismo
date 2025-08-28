import { memo } from 'react';

interface VisuallyHiddenProps {
  children: React.ReactNode;
  asChild?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * VisuallyHidden component for screen readers
 * Renders content that is accessible to screen readers but visually hidden
 */
export const VisuallyHidden = memo(function VisuallyHidden({ 
  children, 
  asChild = false, 
  as: Component = 'span' 
}: VisuallyHiddenProps) {
  const className = "sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0";
  
  if (asChild && typeof children === 'object' && children !== null && 'props' in children) {
    // Clone the child element with sr-only classes
    return {
      ...children,
      props: {
        ...children.props,
        className: `${children.props.className || ''} ${className}`.trim()
      }
    };
  }
  
  return <Component className={className}>{children}</Component>;
});