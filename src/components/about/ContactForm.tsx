"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { z } from "zod";
import { services } from "@/data/services";
import {
  contactSchema,
  type ContactFieldErrors,
  type ContactFormData,
  type ContactResponse,
} from "@/lib/validations";

export type ContactFormProps = Record<string, never>;

export type ContactStatus = "idle" | "sending" | "success" | "error";

const emptyForm: ContactFormData = {
  name: "",
  email: "",
  services: [],
  message: "",
  website: "",
};

const labelClass = "font-serif text-2xl italic";

const inputClass =
  "w-full bg-transparent py-3 text-lg shadow-[inset_0_-1px_0_0_#000] outline-none transition-shadow duration-200 placeholder:text-black/30 focus:shadow-[inset_0_-2px_0_0_#000] aria-invalid:shadow-[inset_0_-1px_0_0_#dc2626] aria-invalid:focus:shadow-[inset_0_-2px_0_0_#dc2626]";

function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p id={id} className="mt-2 text-sm text-red-600">
      {messages[0]}
    </p>
  );
}

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(emptyForm);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<ContactStatus>("idle");
  const reduceMotion = useReducedMotion();

  const update = <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleService = (id: string) => {
    update(
      "services",
      form.services.includes(id)
        ? form.services.filter((s) => s !== id)
        : [...form.services, id],
    );
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json()) as ContactResponse;

      if (data.ok) {
        setStatus("success");
        setForm(emptyForm);
        return;
      }
      if (data.errors) setErrors(data.errors);
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const sending = status === "sending";

  return (
    <section className="mx-auto max-w-3xl">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            role="status"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="py-24"
          >
            <p className="font-serif text-5xl italic sm:text-7xl">got it —</p>
            <p className="mt-2 text-3xl tracking-tight sm:text-5xl">
              we’ll be in touch xx
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="relative flex flex-col gap-12"
          >
            <div className="grid gap-12 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className={labelClass}>
                  name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                  className={inputClass}
                />
                <FieldError id="contact-name-error" messages={errors.name} />
              </div>

              <div>
                <label htmlFor="contact-email" className={labelClass}>
                  email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                  className={inputClass}
                />
                <FieldError id="contact-email-error" messages={errors.email} />
              </div>
            </div>

            <fieldset>
              <legend className={labelClass}>what are you interested in?</legend>
              <div className="mt-4 flex flex-wrap gap-1">
                {services.map((service) => {
                  const selected = form.services.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleService(service.id)}
                      className={`rounded-full px-5 py-2.5 text-lg font-medium tracking-tight transition-colors duration-200 ${
                        selected
                          ? "bg-black text-white"
                          : "bg-black/5 hover:bg-black hover:text-white"
                      }`}
                    >
                      {service.title}
                    </button>
                  );
                })}
              </div>
              <FieldError id="contact-services-error" messages={errors.services} />
            </fieldset>

            <div>
              <label htmlFor="contact-message" className={labelClass}>
                message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
                className={`${inputClass} resize-none`}
              />
              <FieldError id="contact-message-error" messages={errors.message} />
            </div>

            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="contact-website">website</label>
              <input
                id="contact-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
              />
            </div>

            <div className="flex flex-col items-start gap-4">
              <button
                type="submit"
                disabled={sending}
                className="rounded-full bg-black px-10 py-4 text-lg font-medium tracking-tight text-white transition-colors duration-200 hover:bg-[#FFE600] hover:text-black disabled:cursor-wait disabled:opacity-60"
              >
                {sending ? "sending…" : "send"}
              </button>
              {status === "error" && (
                <p role="alert" className="text-sm text-red-600">
                  something went sideways — try again in a moment.
                </p>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
