/** Shared form field — used by the consultation and general enquiry forms. */
export function Field({
  name,
  label,
  type = "text",
  required,
  textarea,
  hint,
  placeholder,
  autoComplete,
  rows = 4,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  hint?: string;
  placeholder?: string;
  autoComplete?: string;
  rows?: number;
}) {
  return (
    <div className={`pg-field${textarea ? " pg-field--wide" : ""}`}>
      <label className="pg-label" htmlFor={name}>
        {label} {required && <span aria-hidden="true">*</span>}
        {hint && <span className="pg-hint">{hint}</span>}
      </label>
      {textarea ? (
        <textarea
          className="pg-input pg-textarea"
          id={name}
          name={name}
          rows={rows}
          required={required}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="pg-input"
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
      )}
    </div>
  );
}

/** Select field with a placeholder option. */
export function SelectField({
  name,
  label,
  options,
  required,
}: {
  name: string;
  label: string;
  options: readonly string[];
  required?: boolean;
}) {
  return (
    <div className="pg-field">
      <label className="pg-label" htmlFor={name}>
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      <select
        className="pg-input"
        id={name}
        name={name}
        defaultValue=""
        required={required}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
