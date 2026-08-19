"use client";

import { useState, type FormEvent } from "react";
import { CONSULTATION } from "@/data/pages-content";

/**
 * Consultation application form — every field from the Website Copy Master.
 *
 * Flow matches the master exactly: the applicant applies, the team reviews,
 * and payment + calendar steps are sent afterwards. That is why there is no
 * card field here — a Stripe secret key can never live in a static bundle, so
 * payment goes through a Stripe Payment Link the team sends on approval.
 *
 * Submissions POST to NEXT_PUBLIC_FORM_ENDPOINT (a hosted form service such as
 * Formspree/Basin, which accepts multipart so the optional upload survives).
 * If that is not configured the form does NOT pretend to succeed — it shows the
 * email fallback, because a form that silently swallows enquiries loses real
 * business.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";
const FALLBACK_EMAIL = "paria@pgpm.ae";

type Status = "idle" | "sending" | "sent" | "error" | "unconfigured";

export function ConsultationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Native validation covers required fields and email format.
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!ENDPOINT) {
      setStatus("unconfigured");
      return;
    }

    setStatus("sending");
    setError("");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again or email " + FALLBACK_EMAIL + ".");
    }
  };

  if (status === "sent") {
    return (
      <div className="pg-form-done" role="status">
        <h3 className="pg-h3">Request received.</h3>
        <p className="pg-body">{CONSULTATION.confirmation}</p>
      </div>
    );
  }

  return (
    <form className="pg-form" onSubmit={onSubmit} noValidate={false}>
      <fieldset className="pg-fieldset">
        <legend className="pg-legend">About you</legend>
        <div className="pg-field-grid">
          <Field name="fullName" label="Full Name" required autoComplete="name" />
          <Field name="company" label="Company or Brand Name" autoComplete="organization" />
          <Field name="jobTitle" label="Job Title" autoComplete="organization-title" />
          <Field name="email" label="Email Address" type="email" required autoComplete="email" />
          <Field name="mobile" label="Mobile Number" type="tel" autoComplete="tel" />
          <Field name="location" label="Country and City" autoComplete="country-name" />
          <Field name="website" label="Company Website" type="url" placeholder="https://" />
          <Field name="social" label="LinkedIn or Instagram" />
        </div>
      </fieldset>

      <fieldset className="pg-fieldset">
        <legend className="pg-legend">Your business</legend>
        <div className="pg-field-grid">
          <Field name="industry" label="Industry" />
          <div className="pg-field">
            <label className="pg-label" htmlFor="stage">
              Current Business Stage
            </label>
            <select className="pg-input" id="stage" name="stage" defaultValue="">
              <option value="" disabled>
                Select…
              </option>
              {CONSULTATION.stages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <Field name="employees" label="Number of Employees" />
          <Field name="revenue" label="Annual Revenue Range" hint="Optional" />
        </div>
      </fieldset>

      <fieldset className="pg-fieldset">
        <legend className="pg-legend">The session</legend>
        <div className="pg-field">
          <label className="pg-label" htmlFor="advice">
            What would you like advice on? <span aria-hidden="true">*</span>
          </label>
          <select className="pg-input" id="advice" name="advice" defaultValue="" required>
            <option value="" disabled>
              Select…
            </option>
            {CONSULTATION.adviceOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <Field
          name="businessDescription"
          label="Describe your business, brand, or current project"
          textarea
          required
        />
        <Field
          name="challenge"
          label="What is your main challenge or decision?"
          textarea
          required
        />
        <Field
          name="outcome"
          label="What outcome would make this session valuable?"
          textarea
        />

        <div className="pg-field-grid">
          <Field
            name="preferredDates"
            label="Preferred dates and time zone"
            placeholder="e.g. Tue–Thu mornings, GST"
          />
          <Field name="referral" label="How did you hear about Paria?" />
        </div>

        <div className="pg-field">
          <label className="pg-label" htmlFor="attachment">
            Upload a presentation or supporting document{" "}
            <span className="pg-hint">Optional — max 10MB</span>
          </label>
          <input
            className="pg-input pg-input--file"
            id="attachment"
            name="attachment"
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.key,.png,.jpg,.jpeg"
          />
        </div>
      </fieldset>

      <label className="pg-consent">
        <input type="checkbox" name="termsAccepted" required />
        <span>I understand the session fee and booking terms.</span>
      </label>

      {status === "unconfigured" && (
        <p className="pg-form-note" role="alert">
          Online submission is not connected yet. Please email your enquiry to{" "}
          <a href={`mailto:${FALLBACK_EMAIL}`}>{FALLBACK_EMAIL}</a> and the team
          will respond with booking and payment steps.
        </p>
      )}
      {status === "error" && (
        <p className="pg-form-note pg-form-note--error" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="pg-btn pg-btn--primary"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Submit Your Request"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  textarea,
  hint,
  placeholder,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  hint?: string;
  placeholder?: string;
  autoComplete?: string;
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
          rows={4}
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
