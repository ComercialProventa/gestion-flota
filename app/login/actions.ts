"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("id", authData.user.id)
    .single();

  const rutasPorRol: Record<string, string> = {
    administrador: "/admin",
    administrativo: "/administrativo",
    taller_conductor: "/operaciones",
  };

  const destino = rutasPorRol[usuario?.rol] || "/login";
  redirect(destino);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
