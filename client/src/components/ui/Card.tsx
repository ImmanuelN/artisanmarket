import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Content: React.FC<CardContentProps>;
  Footer: React.FC<CardFooterProps>;
  Title: React.FC<CardTitleProps>;
  Description: React.FC<CardDescriptionProps>;
} = ({ children, className, hover = false, padding = 'md' }) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const CardComponent = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { y: -4, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-200',
        paddingClasses[padding],
        hover && 'cursor-pointer',
        className
      )}
      {...motionProps}
    >
      {children}
    </CardComponent>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={cn('border-b border-gray-200 pb-4 mb-4', className)}>
    {children}
  </div>
);

const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={cn('', className)}>
    {children}
  </div>
);

const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <div className={cn('border-t border-gray-200 pt-4 mt-4', className)}>
    {children}
  </div>
);

const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => (
  <h3 className={cn('text-lg font-semibold text-gray-900 mb-2', className)}>
    {children}
  </h3>
);

const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => (
  <p className={cn('text-sm text-gray-600', className)}>
    {children}
  </p>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;
