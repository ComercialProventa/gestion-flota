"use client";

import { useState } from "react";
import ChasisPreview from "@/components/buses/chasis-preview";
import { registrarUnidad } from "../actions";

type EjesTipo = "2_ejes_6_ruedas" | "3_ejes_10_ruedas";

const INPUT = "w-full bg-surface rounded-md px-3 py-2 text-[13px] text-foreground placeholder:text-dim focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors";
const LABEL = "block text-[11px] font-medium text-dim mb-1";

export default function NuevaUnidadForm() {
  const [tipo, setTipo] = useState<"bus" | "camion">("bus");
  const [chasis, setChasis] = useState<EjesTipo>("2_ejes_6_ruedas");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFotoPreview(file ? URL.createObjectURL(file) : null);
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    formData.set("tipo", tipo);
    formData.set("chasis", chasis);
    if (tipo === "camion") formData.delete("asientos");
    const result = await registrarUnidad(formData);
    if (result?.error) { setError(result.error); setLoading(false); }
  }

  return (
    <form action={handleSubmit} className="space-y-5 max-w-lg">
      {error && <p className="text-[12px] text-red">! {error}</p>}

      {/* Tipo */}
      <div>
        <label className={LABEL}>Tipo de Vehículo</label>
        <div className="flex gap-2">
          {(["bus", "camion"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors cursor-pointer ${
                tipo === t ? "bg-surface-hover text-foreground" : "text-dim hover:text-foreground"
              }`}
            >
              {t === "bus" ? "Bus" : "Camión"}
            </button>
          ))}
        </div>
        <input type="hidden" name="tipo" value={tipo} />
      </div>

      {/* Patente */}
      <div>
        <label htmlFor="patente" className={LABEL}>Patente</label>
        <input id="patente" name="patente" type="text" required placeholder="ABCD-12" className={`${INPUT} uppercase font-mono`} />
      </div>

      {/* Foto */}
      <div>
        <label htmlFor="foto" className={LABEL}>Fotografía</label>
        <div className="flex items-center gap-3">
          {fotoPreview && (
            <div className="h-12 w-12 overflow-hidden rounded-md bg-surface shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fotoPreview} alt="Preview" className="h-full w-full object-cover" />
            </div>
          )}
          <input id="foto" name="foto" type="file" accept="image/*" onChange={handleFotoChange}
            className="block w-full text-[12px] text-dim file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[11px] file:font-medium file:bg-surface file:text-foreground hover:file:bg-surface-hover cursor-pointer"
          />
        </div>
      </div>

      {/* Marca / Modelo */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="marca" className={LABEL}>Marca</label>
          <input id="marca" name="marca" type="text" required placeholder="Mercedes-Benz" className={INPUT} />
        </div>
        <div>
          <label htmlFor="modelo" className={LABEL}>Modelo</label>
          <input id="modelo" name="modelo" type="text" required placeholder="O-500" className={INPUT} />
        </div>
      </div>

      {/* Año / Asientos(solo bus) / Estanque */}
      <div className={`grid gap-3 ${tipo === "bus" ? "grid-cols-3" : "grid-cols-2"}`}>
        <div>
          <label htmlFor="ano" className={LABEL}>Año</label>
          <input id="ano" name="ano" type="number" required min={1990} max={new Date().getFullYear() + 1} placeholder="2022" className={INPUT} />
        </div>
        {tipo === "bus" && (
          <div>
            <label htmlFor="asientos" className={LABEL}>Asientos</label>
            <input id="asientos" name="asientos" type="number" min={1} max={100} placeholder="44" className={INPUT} />
          </div>
        )}
        <div>
          <label htmlFor="capacidad_estanque" className={LABEL}>Estanque (Lt)</label>
          <input id="capacidad_estanque" name="capacidad_estanque" type="number" min={1} max={2000} placeholder="400" className={INPUT} />
        </div>
      </div>

      {/* Chasis */}
      <div>
        <label className={LABEL}>Configuración de Ejes</label>
        <input type="hidden" name="chasis" value={chasis} />
        <div className="flex gap-2">
          {(["2_ejes_6_ruedas", "3_ejes_10_ruedas"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChasis(c)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors cursor-pointer ${
                chasis === c ? "bg-surface-hover text-foreground" : "text-dim hover:text-foreground"
              }`}
            >
              {c === "2_ejes_6_ruedas" ? "2 ejes (6 ruedas)" : "3 ejes (10 ruedas)"}
            </button>
          ))}
        </div>
        <div className="mt-3 opacity-50 hover:opacity-100 transition-opacity">
          <ChasisPreview tipo={chasis} />
        </div>
      </div>

      {/* Vigencias */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="vencimiento_revision_tecnica" className={LABEL}>Venc. Rev. Técnica</label>
          <input id="vencimiento_revision_tecnica" name="vencimiento_revision_tecnica" type="date" className={INPUT} style={{ colorScheme: "dark" }} />
        </div>
        <div>
          <label htmlFor="vencimiento_seguro" className={LABEL}>Venc. Seguro</label>
          <input id="vencimiento_seguro" name="vencimiento_seguro" type="date" className={INPUT} style={{ colorScheme: "dark" }} />
        </div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading} className="text-[13px] font-medium text-accent hover:text-accent-hover transition-colors cursor-pointer disabled:opacity-50">
        {loading ? "Registrando..." : "Registrar unidad"}
      </button>
    </form>
  );
}
