import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { calcularVigencia } from "@/utils/fechas";

// Route Handler Config (for cron job or external trigger)
export const dynamic = "force-dynamic"; 

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_build");
const destinatarios = (process.env.EMAIL_GERENCIA || "gerencia@ejemplo.com").split(",");

export async function GET(request: Request) {
  try {
    // Validar un simple secret token para proteger el endpoint (opcional pero recomendado)
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret");
    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Usar el cliente Supabase con Service Role porque esto corre en background (sin usuario)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    // Si no hay service role, caemos al anon, pero ojo con el RLS.
    // Para simplificar, asumiremos que se provee SUPABASE_SERVICE_ROLE_KEY o se bypassa RLS
    const supabase = createClient(supabaseUrl, supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    // 1. Obtener Alertas del Sistema de las últimas 24 horas
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const ayerIso = ayer.toISOString();

    const { data: alertas } = await supabase
      .from("alertas_sistema")
      .select(`
        id,
        tipo,
        severidad,
        titulo,
        detalle,
        creado_en,
        buses ( patente )
      `)
      .gte("creado_en", ayerIso)
      .order("severidad", { ascending: true }) // alta/critica primero (asumiendo texto o enum)
      .order("creado_en", { ascending: false });

    // 2. Obtener Vigencias Críticas (Rojas o Amarillas)
    const { data: buses } = await supabase
      .from("buses")
      .select("patente, vencimiento_revision_tecnica, vencimiento_seguro");

    const vigenciasPorVencer: Array<{ patente: string, doc: string, dias: number, estado: string }> = [];

    if (buses) {
      for (const bus of buses) {
        if (bus.vencimiento_revision_tecnica) {
          const vig = calcularVigencia(bus.vencimiento_revision_tecnica);
          if (vig && (vig.estadoColor === "rojo" || vig.estadoColor === "amarillo")) {
            vigenciasPorVencer.push({ patente: bus.patente, doc: "Revisión Técnica", dias: vig.diasRestantes, estado: vig.estadoColor });
          }
        }
        if (bus.vencimiento_seguro) {
          const vig = calcularVigencia(bus.vencimiento_seguro);
          if (vig && (vig.estadoColor === "rojo" || vig.estadoColor === "amarillo")) {
            vigenciasPorVencer.push({ patente: bus.patente, doc: "SOAP", dias: vig.diasRestantes, estado: vig.estadoColor });
          }
        }
      }
    }

    // Ordenar vigencias por días restantes
    vigenciasPorVencer.sort((a, b) => a.dias - b.dias);

    // 3. Construir el HTML del Email
    const htmlEmail = renderizarEmailHtml(alertas || [], vigenciasPorVencer);

    // 4. Enviar usando Resend
    if (!process.env.RESEND_API_KEY) {
      console.warn("No RESEND_API_KEY configurada. Se simula el envío.");
      return NextResponse.json({ 
        success: true, 
        message: "Email simulado con éxito (Falta RESEND_API_KEY)", 
        alertas: alertas?.length, 
        vigencias: vigenciasPorVencer.length 
      });
    }

    const { data, error } = await resend.emails.send({
      from: "Inteligencia Flota <onboarding@resend.dev>", // Usa un dominio verificado en prod
      to: destinatarios,
      subject: `Resumen de Operaciones y Alertas - ${new Date().toLocaleDateString("es-CL")}`,
      html: htmlEmail,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      resendId: data?.id,
      alertasEnviadas: alertas?.length,
      vigenciasEnviadas: vigenciasPorVencer.length
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── Generador de HTML (Sencillo) ───
function renderizarEmailHtml(alertas: any[], vigencias: any[]) {
  const alertasHtml = alertas.length > 0 
    ? alertas.map(a => `
      <div style="margin-bottom: 15px; padding: 10px; border-left: 4px solid ${a.severidad === 'critica' || a.severidad === 'alta' ? '#ef4444' : '#f59e0b'}; background-color: #f9fafb;">
        <h4 style="margin: 0 0 5px; color: #111827;">${a.titulo}</h4>
        <p style="margin: 0; font-size: 14px; color: #4b5563;">${a.detalle}</p>
        <small style="color: #6b7280;">Registrada: ${new Date(a.creado_en).toLocaleString("es-CL")}</small>
      </div>
    `).join("")
    : `<p style="color: #10b981; font-weight: bold;">Sin alertas críticas en las últimas 24 horas. Todo en orden. ✅</p>`;

  const vigenciasHtml = vigencias.length > 0
    ? `
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="background-color: #f3f4f6; text-align: left;">
            <th style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Unidad</th>
            <th style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Documento</th>
            <th style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Estado</th>
          </tr>
        </thead>
        <tbody>
          ${vigencias.map(v => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-family: monospace;">${v.patente}</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${v.doc}</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: ${v.estado === 'rojo' ? '#ef4444' : '#d97706'}; font-weight: bold;">
                ${v.dias <= 0 ? "VENCIDO" : `Vence en ${v.dias} días`}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `
    : `<p style="color: #10b981;">No hay vigencias por vencer en los próximos 10 días.</p>`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #374151;">
      <div style="background-color: #1e293b; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">Centro de Inteligencia</h2>
        <p style="margin: 5px 0 0; color: #94a3b8;">Resumen Diario Automático</p>
      </div>
      
      <div style="padding: 20px;">
        <h3 style="color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">🚨 Alertas Recientes (Últimas 24h)</h3>
        ${alertasHtml}

        <h3 style="color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-top: 30px;">📄 Vigencias Críticas</h3>
        ${vigenciasHtml}
      </div>

      <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
        Este es un mensaje automático generado por el Sistema de Gestión de Flota.<br/>
        NO responda a este correo.
      </div>
    </div>
  `;
}
