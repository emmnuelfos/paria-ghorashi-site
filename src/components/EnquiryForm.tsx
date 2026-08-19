"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Field, SelectField } from "@/components/FormField";
import { CONTACT, FORM_ERRORS } from "@/data/pages-content-3";

/**
 * General enquiry form — every field from the master's Contact page.
 *
 * Posts to NEXT_PUBLIC_FORM_ENDPOINT (a hosted form service). The master asks
 * for "different email routing rules based on enquiry type", so the selected
 * type is submitted as `_subject` too, which routing rules can key on.
 *
 * When the endpoint is unconfigured this shows the email fallback rather than
 * reporting a false success — a form that quietly drops enquiries loses real
 * business.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";
const FALLBACK_EMAIL = CONTACT.details.email;

type Status = "idle" | "sending" | "sent" | "error" | "unconfigured";

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);

    // Guard the upload before it reaches the network.
    const file = data.get("attachment");
    if (file instanceof File && file.size > 10 * 1024 * 1024) {
      setStatus("error");
      setMessage(FORM_ERRORS.fileTooLarge);
      return;
    }

    const type = String(data.get("enquiryType") ?? "Enquiry");
    data.append("_subject", `Website enquiry — ${type}`);

    if (!ENDPOINT) {
      setStatus("unconfigured");
      return;
    }

    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setMessage(FORM_ERRORS.generic);
    }
  };

  if (status === "sent") {
    return (
      <div className="pg-form-done" role="status">
        <h3 className="pg-h3">Enquiry received.</h3>
        <p className="pg-body">{CONTACT.confirmation}</p>
      </div>
    );
  }

  return (
    <form className="pg-form" onSubmit={onSubmit}>
      <fieldset className="pg-fieldset">
        <legend className="pg-legend">Your details</legend>
        <div className="pg-field-grid">
          <Field name="fullName" label="Full Name" required autoComplete="name" />
          <Field
            name="organisation"
            label="Company or Organisation"
            autoComplete="organization"
          />
          <Field
            name="jobTitle"
            label="Job Title"
            autoComplete="organization-title"
          />
          <Field name="email" label="Email" type="email" required autoComplete="email" />
          <Field name="phone" label="Phone Number" type="tel" autoComplete="tel" />
          <Field name="country" label="Country" autoComplete="country-name" />
          <Field name="website" label="Website" type="url" placeholder="https://" />
          <SelectField
            name="enquiryType"
            label="Enquiry Type"
            options={CONTACT.enquiryTypes}
            required
          />
        </div>
      </fieldset>

      <fieldset className="pg-fieldset">
        <legend className="pg-legend">The opportunity</legend>
        <Field
          name="opportunity"
          label="Project or Opportunity"
          textarea
          required
        />
        <Field
          name="support"
          label="What support are you seeking?"
          textarea
          required
        />
        <div className="pg-field-grid">
          <Field name="timing" label="Proposed timing" />
          <Field name="budget" label="Budget range" />
          <Field name="referral" label="How did you hear about Paria?" />
        </div>
        <div className="pg-field">
          <label className="pg-label" htmlFor="attachment">
            Upload supporting document{" "}
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
        <input type="checkbox" name="privacyConsent" required />
        <span>
          I consent to the <Link href="/privacy">Privacy Policy</Link>.
        </span>
      </label>

      {status === "unconfigured" && (
        <p className="pg-form-note" role="alert">
          Online submission is not connected yet. Please email your enquiry to{" "}
          <a href={`mailto:${FALLBACK_EMAIL}`}>{FALLBACK_EMAIL}</a> and the team
          will respond.
        </p>
      )}
      {status === "error" && (
        <p className="pg-form-note pg-form-note--error" role="alert">
          {message}
        </p>
      )}

      <button
        type="submit"
        className="pg-btn pg-btn--primary"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
