import { z } from "zod";
import { services } from "@/data/services";

const serviceIds = new Set(services.map((service) => service.id));

export const contactSchema = z.object({
  name: z.string().trim().min(1, { error: "we’ll need a name" }),
  email: z
    .string()
    .trim()
    .pipe(z.email({ error: "that email looks a little off" })),
  services: z
    .array(z.string())
    .refine((ids) => ids.every((id) => serviceIds.has(id)), {
      error: "pick from the list",
    }),
  message: z
    .string()
    .trim()
    .min(10, { error: "tell us a bit more — 10 characters at least" }),
  // Honeypot: real people never see this field, so it should arrive empty.
  website: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export type ContactField = keyof ContactFormData;

export type ContactFieldErrors = Partial<Record<ContactField, string[]>>;

export type ContactResponse =
  | { ok: true }
  | { ok: false; errors?: ContactFieldErrors };
