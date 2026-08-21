'use client';

import { useEffect, useRef, useState } from 'react';

type TemperatureMode = 'conservative' | 'creative';

type FieldProps = {
  name: string;
  title: string;
  guide: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onAiSuggest?: (temperatureMode: TemperatureMode) => Promise<string[]>;
  aiSuggestLabel?: string;
  aiLoadingLabel?: string;
  aiErrorLabel?: string;
  aiConservativeLabel?: string;
  aiCreativeLabel?: string;
};

const Field = ({
  name,
  title,
  guide,
  placeholder,
  value,
  onChange,
  onAiSuggest,
  aiSuggestLabel,
  aiLoadingLabel,
  aiErrorLabel,
  aiConservativeLabel,
  aiCreativeLabel,
}: FieldProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [temperatureMode, setTemperatureMode] = useState<TemperatureMode>('conservative');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const handleGetSuggestions = async () => {
    if (!onAiSuggest) return;
    setLoading(true);
    setError(false);
    setSuggestions([]);
    try {
      const result = await onAiSuggest(temperatureMode);
      setSuggestions(result);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePickSuggestion = (suggestion: string) => {
    onChange(value.trim() ? `${value}\n${suggestion}` : suggestion);
    setSuggestions([]);
  };

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

      {onAiSuggest && (
        <div className="mt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex rounded-md border border-accent-muted overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setTemperatureMode('conservative')}
                className={`cursor-pointer px-2 py-1 transition-colors ${
                  temperatureMode === 'conservative'
                    ? 'bg-accent text-background'
                    : 'bg-transparent text-text-muted hover:text-foreground'
                }`}
              >
                {aiConservativeLabel ?? 'Conservative'}
              </button>
              <button
                type="button"
                onClick={() => setTemperatureMode('creative')}
                className={`cursor-pointer px-2 py-1 transition-colors ${
                  temperatureMode === 'creative'
                    ? 'bg-accent text-background'
                    : 'bg-transparent text-text-muted hover:text-foreground'
                }`}
              >
                {aiCreativeLabel ?? 'Creative'}
              </button>
            </div>
            <button
              type="button"
              onClick={handleGetSuggestions}
              disabled={loading}
              className="cursor-pointer text-xs px-3 py-1.5 rounded-md border border-accent-muted text-accent hover:bg-accent-muted/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (aiLoadingLabel ?? 'Thinking…') : (aiSuggestLabel ?? 'Get Suggestions')}
            </button>
          </div>

          {error && <p className="text-xs text-red-500 mt-2">{aiErrorLabel ?? "Couldn't get suggestions. Try again."}</p>}

          {suggestions.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePickSuggestion(suggestion)}
                  className="cursor-pointer text-left text-sm px-3 py-2 rounded-md bg-surface border border-accent-muted hover:border-accent transition-colors text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Field;
