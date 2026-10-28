import { z } from "zod";
import { contactSchema, type ContactResponse } from "@/lib/validations";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false } satisfies ContactResponse, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, errors: z.flattenError(parsed.error).fieldErrors } satisfies ContactResponse,
      { status: 400 },
    );
  }

  const { website, ...data } = parsed.data;

  // Honeypot filled in: it's a bot. Answer ok so it doesn't retry, but drop it.
  if (website) {
    return Response.json({ ok: true } satisfies ContactResponse);
  }

  console.log("[contact]", data);

  // Resend: conectar acá para enviar el correo.
  // 1. npm install resend y agregar RESEND_API_KEY en .env.local
  // 2. import { Resend } from "resend";
  //    const resend = new Resend(process.env.RESEND_API_KEY);
  // 3. const { error } = await resend.emails.send({
  //      from: "unstudio <hola@tu-dominio.com>",
  //      to: ["hola@tu-dominio.com"],
  //      replyTo: data.email,
  //      subject: `New contact from ${data.name}`,
  //      text: `${data.message}\n\nServicios: ${data.services.join(", ")}\n\n${JSON.stringify(data.answers, null, 2)}`,
  //    });
  // 4. if (error) return Response.json({ ok: false } satisfies ContactResponse, { status: 502 });

  return Response.json({ ok: true } satisfies ContactResponse);
}
