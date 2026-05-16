import { ReactNode } from "react";

interface Props {
  label?: string;
  helper?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

const FieldWrap = ({ label, helper, error, required, children }: Props) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-sm text-foreground font-body">
        {label}
        {required && <span className="text-primary mr-1">*</span>}
      </label>
    )}
    <div className={`border-b transition-colors ${error ? "border-destructive" : "border-border focus-within:border-primary"}`}>
      {children}
    </div>
    {error ? (
      <p className="text-xs text-destructive font-body">{error}</p>
    ) : helper ? (
      <p className="text-xs text-muted-foreground/70 font-body">{helper}</p>
    ) : null}
  </div>
);

export default FieldWrap;
