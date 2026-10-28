import { z } from "zod";
import { services, type Service } from "@/data/services";

const serviceIds = new Set(services.map((service) => service.id));

export type AnswerValue = string | string[];

export type ServiceAnswers = Record<string, AnswerValue>;

export type ContactAnswers = Record<string, ServiceAnswers>;

const answerValue = z.union([z.string().trim(), z.array(z.string())]);

// Returns one message per invalid question, keyed by question id.
export function validateServiceAnswers(
  service: Service,
  answers: ServiceAnswers = {},
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const question of service.questions) {
    const value = answers[question.id];
    const values = Array.isArray(value) ? value : value ? [value] : [];

    if (question.required && values.length === 0) {
      errors[question.id] =
        question.type === "text" ? "cuéntanos un poco aquí" : "elige al menos una opción";
      continue;
    }
    if (question.type === "single" && values.length > 1) {
      errors[question.id] = "elige solo una opción";
      continue;
    }
    if (question.options && values.some((v) => !question.options?.includes(v))) {
      errors[question.id] = "elige de la lista";
    }
  }

  return errors;
}

export const contactSchema = z
  .object({
    name: z.string().trim().min(1, { error: "necesitamos tu nombre" }),
    email: z
      .string()
      .trim()
      .pipe(z.email({ error: "ese correo no parece válido" })),
    services: z
      .array(z.string())
      .min(1, { error: "elige al menos un servicio" })
      .refine((ids) => ids.every((id) => serviceIds.has(id)), {
        error: "elige de la lista",
      }),
    answers: z.record(z.string(), z.record(z.string(), answerValue)),
    message: z
      .string()
      .trim()
      .min(10, { error: "cuéntanos un poco más — mínimo 10 caracteres" }),
    // Honeypot: real people never see this field, so it should arrive empty.
    website: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    for (const service of services) {
      if (!data.services.includes(service.id)) continue;
      const errors = validateServiceAnswers(service, data.answers[service.id]);
      for (const [questionId, message] of Object.entries(errors)) {
        ctx.addIssue({ code: "custom", path: ["answers", service.id, questionId], message });
      }
    }
  });

export type ContactFormData = z.infer<typeof contactSchema>;

export type ContactField = keyof ContactFormData;

export type ContactFieldErrors = Partial<Record<ContactField, string[]>>;

export type ContactResponse =
  | { ok: true }
  | { ok: false; errors?: ContactFieldErrors };
