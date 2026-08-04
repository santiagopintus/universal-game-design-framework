type FieldProps = { title: string; guide: string; placeholder: string };

const Field = ({ title, guide, placeholder }: FieldProps) => (
  <div className="mb-6">
    <label className="block font-semibold mb-1 text-foreground">{title}</label>
    <p className="text-sm text-text-muted mb-2">{guide}</p>
    <textarea
      className="w-full min-h-28 bg-background border border-accent-muted rounded-lg p-3 text-foreground placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
      placeholder={placeholder}
    />
  </div>
);

export default Field;
