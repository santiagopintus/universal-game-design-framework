'use client';

import { useEffect, useRef, useState } from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';

type TemperatureMode = 'conservative' | 'creative';

type FieldProps = {
  name: string;
  title: string;
  guide: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onAiSuggest?: (temperatureMode: TemperatureMode) => Promise<string[]>;
  aiHintLabel?: string;
  aiSuggestLabel?: string;
  aiLoadingLabel?: string;
  aiErrorLabel?: string;
  aiConservativeLabel?: string;
  aiCreativeLabel?: string;
};

const tooltipSx = {
  bgcolor: 'color-mix(in srgb, var(--color-surface) 92%, transparent)',
  border: '1px solid var(--color-accent-muted)',
  borderRadius: '0.75rem',
  color: 'var(--color-text)',
  fontSize: '0.75rem',
  padding: '0.5rem 0.75rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
};

const Field = ({
  name,
  title,
  guide,
  placeholder,
  value,
  onChange,
  onAiSuggest,
  aiHintLabel,
  aiSuggestLabel,
  aiLoadingLabel,
  aiErrorLabel,
  aiConservativeLabel,
  aiCreativeLabel,
}: FieldProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [wandButton, setWandButton] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
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
  };

  return (
    <div className="mb-6">
      <label htmlFor={name} className="block font-semibold mb-1 text-foreground">
        {title}
      </label>
      <p className="text-sm text-text-muted mb-2">{guide}</p>
      <div className="relative">
        <textarea
          ref={textareaRef}
          id={name}
          className="w-full min-h-[112px] max-h-[400px] overflow-y-auto resize-none bg-background border border-accent-muted rounded-lg p-3 pr-10 text-foreground placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        {onAiSuggest && (
          <Tooltip
            title={aiHintLabel ?? 'Get AI generated suggestions based on your project definitions'}
            arrow
            placement="top"
            slotProps={{
              tooltip: { sx: tooltipSx },
              arrow: { sx: { color: 'color-mix(in srgb, var(--color-surface) 92%, transparent)' } },
            }}
          >
            <button
              ref={setWandButton}
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={aiHintLabel ?? 'Get AI suggestions'}
              className={`cursor-pointer absolute bottom-2 right-2 flex items-center justify-center w-7 h-7 rounded-md border transition-colors ${
                suggestions.length > 0
                  ? 'bg-accent border-accent'
                  : 'bg-surface border-accent-muted hover:border-accent'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                viewBox="0 -960 960 960"
                width="18px"
                fill={suggestions.length > 0 ? 'var(--color-surface)' : 'var(--color-accent)'}
              >
                <path d="m176-120-56-56 301-302-181-45 198-123-17-234 179 151 216-88-87 217 151 178-234-16-124 198-45-181-301 301Zm24-520-80-80 80-80 80 80-80 80Zm355 197 48-79 93 7-60-71 35-86-86 35-71-59 7 92-79 49 90 22 23 90Zm165 323-80-80 80-80 80 80-80 80ZM569-570Z" />
              </svg>
            </button>
          </Tooltip>
        )}

        {onAiSuggest && open && (
          <Popper
            open={open}
            anchorEl={wandButton}
            placement="right-start"
            style={{ zIndex: 20 }}
            modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
          >
            <ClickAwayListener onClickAway={() => setOpen(false)}>
              <div className="w-72 bg-surface border border-accent-muted rounded-xl shadow-lg p-3">
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
                        className="cursor-pointer text-left text-sm px-3 py-2 rounded-md bg-background border border-accent-muted hover:border-accent transition-colors text-foreground"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ClickAwayListener>
          </Popper>
        )}
      </div>
    </div>
  );
};

export default Field;
