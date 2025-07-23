'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="top-right"
      richColors
      closeButton
      expand={false}
      visibleToasts={5}
      toastOptions={{
        style: {
          background: 'var(--background)',
          border: '1px solid var(--border)',
          color: 'var(--foreground)',
          fontSize: '14px',
          fontWeight: '500',
        },
        className: 'toast-custom',
        descriptionClassName: 'toast-description',
        actionButtonStyle: {
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '13px',
          fontWeight: '500',
        },
        cancelButtonStyle: {
          background: 'var(--secondary)',
          color: 'var(--secondary-foreground)',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '13px',
          fontWeight: '500',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--background)',
          '--normal-text': 'var(--foreground)',
          '--normal-border': 'var(--border)',
          '--success-bg': 'var(--background)',
          '--success-text': 'hsl(142 71% 45%)',
          '--success-border': 'hsl(142 71% 45%)',
          '--error-bg': 'var(--background)',
          '--error-text': 'hsl(0 84% 60%)',
          '--error-border': 'hsl(0 84% 60%)',
          '--warning-bg': 'var(--background)',
          '--warning-text': 'hsl(38 92% 50%)',
          '--warning-border': 'hsl(38 92% 50%)',
          '--info-bg': 'var(--background)',
          '--info-text': 'hsl(199 89% 48%)',
          '--info-border': 'hsl(199 89% 48%)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
