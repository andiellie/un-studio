"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { services, type Service, type ServiceQuestion } from "@/data/services";
import {
  contactSchema,
  validateServiceAnswers,
  type AnswerValue,
  type ContactAnswers,
  type ContactResponse,
} from "@/lib/validations";

export type ContactFormProps = Record<string, never>;

export type ContactStatus = "idle" | "sending" | "success" | "error";

export type ContactStep =
  | { kind: "services" }
  | { kind: "service"; service: Service }
  | { kind: "contact" };

type ContactDetails = {
  name: string;
  email: string;
  message: string;
  website: string;
};

const emptyDetails: ContactDetails = { name: "", email: "", message: "", website: "" };

const labelClass = "font-serif text-2xl italic";

const inputClass =
  "w-full bg-transparent py-3 text-lg shadow-[inset_0_-1px_0_0_#000] outline-none transition-shadow duration-200 placeholder:text-black/30 focus:shadow-[inset_0_-2px_0_0_#000] aria-invalid:shadow-[inset_0_-1px_0_0_#dc2626] aria-invalid:focus:shadow-[inset_0_-2px_0_0_#dc2626]";

const pillClass = (selected: boolean) =>
  `rounded-full px-5 py-2.5 text-lg font-medium tracking-tight transition-colors duration-200 ${
    selected ? "bg-black text-white" : "bg-black/5 hover:bg-black hover:text-white"
  }`;

const primaryButtonClass =
  "rounded-full bg-black px-10 py-4 text-lg font-medium tracking-tight text-white transition-colors duration-200 hover:bg-[#FFE600] hover:text-black disabled:cursor-wait disabled:opacity-60";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm text-red-600">
      {message}
    </p>
  );
}

function stepKey(step: ContactStep) {
  return step.kind === "service" ? `service-${step.service.id}` : step.kind;
}

function QuestionField({
  question,
  value,
  error,
  onChange,
}: {
  question: ServiceQuestion;
  value?: AnswerValue;
  error?: string;
  onChange: (value: AnswerValue) => void;
}) {
  const fieldId = `q-${question.id}`;
  const errorId = `${fieldId}-error`;

  if (question.type === "text") {
    return (
      <div>
        <label htmlFor={fieldId} className={labelClass}>
          {question.label}
          {!question.required && <span className="text-black/40"> (opcional)</span>}
        </label>
        <input
          id={fieldId}
          value={typeof value === "string" ? value : ""}
          placeholder={question.placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={inputClass}
        />
        <FieldError id={errorId} message={error} />
      </div>
    );
  }

  const selected = Array.isArray(value) ? value : value ? [value] : [];

  const toggle = (option: string) => {
    if (question.type === "single") {
      onChange(option);
      return;
    }
    onChange(
      selected.includes(option) ? selected.filter((o) => o !== option) : [...selected, option],
    );
  };

  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className={labelClass}>
        {question.label}
        {question.type === "multi" && (
          <span className="text-black/40"> (puedes elegir varias)</span>
        )}
      </legend>
      <div className="mt-4 flex flex-wrap gap-1">
        {question.options?.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={selected.includes(option)}
            onClick={() => toggle(option)}
            className={pillClass(selected.includes(option))}
          >
            {option}
          </button>
        ))}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}

export default function ContactForm() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [answers, setAnswers] = useState<ContactAnswers>({});
  const [details, setDetails] = useState<ContactDetails>(emptyDetails);
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<ContactStatus>("idle");
  const reduceMotion = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasNavigated = useRef(false);

  const steps: ContactStep[] = [
    { kind: "services" },
    ...services
      .filter((service) => selectedServices.includes(service.id))
      .map((service) => ({ kind: "service" as const, service })),
    { kind: "contact" },
  ];
  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const isLastStep = step.kind === "contact";

  useEffect(() => {
    if (hasNavigated.current) headingRef.current?.focus();
  }, [stepIndex]);

  const clearError = (key: string) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
    clearError("services");
  };

  const updateAnswer = (serviceId: string, questionId: string, value: AnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], [questionId]: value },
    }));
    clearError(questionId);
  };

  const updateDetail = (key: keyof ContactDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
    clearError(key);
  };

  const goTo = (index: number) => {
    hasNavigated.current = true;
    setErrors({});
    setStepIndex(index);
  };

  function validateStep(): boolean {
    if (step.kind === "services") {
      if (selectedServices.length === 0) {
        setErrors({ services: "elige al menos un servicio" });
        return false;
      }
      return true;
    }
    if (step.kind === "service") {
      const stepErrors = validateServiceAnswers(step.service, answers[step.service.id]);
      setErrors(stepErrors);
      return Object.keys(stepErrors).length === 0;
    }
    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLastStep) {
      if (validateStep()) goTo(stepIndex + 1);
      return;
    }

    const parsed = contactSchema.safeParse({
      ...details,
      services: selectedServices,
      answers: Object.fromEntries(
        selectedServices.map((id) => [id, answers[id] ?? {}]),
      ),
    });
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        nextErrors[key] ??= issue.message;
      }
      setErrors(nextErrors);
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
        return;
      }
      if (data.errors) {
        setErrors(
          Object.fromEntries(
            Object.entries(data.errors).map(([key, messages]) => [key, messages?.[0] ?? ""]),
          ),
        );
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const sending = status === "sending";

  const stepMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: 32 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -32 },
      };

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
            <p className="font-serif text-5xl italic sm:text-7xl">¡listo! —</p>
            <p className="mt-2 text-3xl tracking-tight sm:text-5xl">
              te escribimos pronto xx
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="mb-12">
              <p className="text-sm text-black/50">
                paso {stepIndex + 1} de {steps.length}
              </p>
              <div className="mt-3 h-px w-full bg-black/10">
                <div
                  className="h-px bg-black transition-[width] duration-500 ease-out"
                  style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={stepKey(step)}
                {...stepMotion}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-12"
              >
                {step.kind === "services" && (
                  <>
                    <h2
                      ref={headingRef}
                      tabIndex={-1}
                      className="text-4xl tracking-tight outline-none sm:text-5xl"
                    >
                      ¿en qué te podemos ayudar?
                    </h2>
                    <fieldset aria-describedby={errors.services ? "services-error" : undefined}>
                      <legend className={labelClass}>
                        elige uno o más servicios
                      </legend>
                      <div className="mt-4 flex flex-wrap gap-1">
                        {services.map((service) => {
                          const selected = selectedServices.includes(service.id);
                          return (
                            <button
                              key={service.id}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => toggleService(service.id)}
                              className={pillClass(selected)}
                            >
                              {service.title}
                              <span className="opacity-50"> · {service.subtitle}</span>
                            </button>
                          );
                        })}
                      </div>
                      <FieldError id="services-error" message={errors.services} />
                    </fieldset>
                  </>
                )}

                {step.kind === "service" && (
                  <>
                    <h2
                      ref={headingRef}
                      tabIndex={-1}
                      className="text-4xl tracking-tight outline-none sm:text-5xl"
                    >
                      {step.service.title}
                      <span className="block font-serif text-2xl text-black/50 italic sm:text-3xl">
                        {step.service.subtitle}
                      </span>
                    </h2>
                    {step.service.questions.map((question) => (
                      <QuestionField
                        key={question.id}
                        question={question}
                        value={answers[step.service.id]?.[question.id]}
                        error={errors[question.id]}
                        onChange={(value) => updateAnswer(step.service.id, question.id, value)}
                      />
                    ))}
                  </>
                )}

                {step.kind === "contact" && (
                  <>
                    <h2
                      ref={headingRef}
                      tabIndex={-1}
                      className="text-4xl tracking-tight outline-none sm:text-5xl"
                    >
                      ¿cómo te contactamos?
                    </h2>
                    <div className="grid gap-12 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-name" className={labelClass}>
                          nombre
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          autoComplete="name"
                          value={details.name}
                          onChange={(e) => updateDetail("name", e.target.value)}
                          aria-invalid={errors.name ? true : undefined}
                          aria-describedby={errors.name ? "contact-name-error" : undefined}
                          className={inputClass}
                        />
                        <FieldError id="contact-name-error" message={errors.name} />
                      </div>

                      <div>
                        <label htmlFor="contact-email" className={labelClass}>
                          correo
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={details.email}
                          onChange={(e) => updateDetail("email", e.target.value)}
                          aria-invalid={errors.email ? true : undefined}
                          aria-describedby={errors.email ? "contact-email-error" : undefined}
                          className={inputClass}
                        />
                        <FieldError id="contact-email-error" message={errors.email} />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className={labelClass}>
                        mensaje
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={4}
                        value={details.message}
                        onChange={(e) => updateDetail("message", e.target.value)}
                        aria-invalid={errors.message ? true : undefined}
                        aria-describedby={errors.message ? "contact-message-error" : undefined}
                        className={`${inputClass} resize-none`}
                      />
                      <FieldError id="contact-message-error" message={errors.message} />
                    </div>

                    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                      <label htmlFor="contact-website">website</label>
                      <input
                        id="contact-website"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={details.website}
                        onChange={(e) => updateDetail("website", e.target.value)}
                      />
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-12 flex flex-wrap items-center gap-6">
              <button type="submit" disabled={sending} className={primaryButtonClass}>
                {isLastStep ? (sending ? "enviando…" : "enviar") : "siguiente"}
              </button>
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={() => goTo(stepIndex - 1)}
                  disabled={sending}
                  className="text-lg tracking-tight underline-offset-4 hover:underline"
                >
                  ← atrás
                </button>
              )}
            </div>
            {status === "error" && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                algo salió mal — intenta de nuevo en un momento.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
