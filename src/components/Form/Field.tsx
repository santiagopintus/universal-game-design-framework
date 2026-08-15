'use client';

import { useEffect, useRef } from 'react';

type FieldProps = {
  name: string;
  title: string;
  guide: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

const Field = ({ name, title, guide, placeholder, value, onChange }: FieldProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <div className="mb-6">
      <label htmlFor={name} className="block font-semibold mb-1 text-foreground">
        {title}
      </label>
      <p className="text-sm text-text-muted mb-2">{guide}</p>
      <textarea
        ref={textareaRef}
        id={name}
        className="w-full min-h-[112px] max-h-[400px] overflow-y-auto resize-none bg-background border border-accent-muted rounded-lg p-3 text-foreground placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default Field;
