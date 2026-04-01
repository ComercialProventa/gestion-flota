# Dashboard de Combustible — Guía para Gerencia

## ¿Qué es esto?

Este dashboard analiza automáticamente cuánto gasta la flota en combustible, detecta problemas, y te dice qué hacer. Todo se calcula solo a partir de las cargas que los conductores registran en el sistema.

---

## Los 6 Números que Importa (KPIs)

Estos aparecen arriba del todo. Son el resumen ejecutivo.

| Indicador | Qué significa | Ejemplo |
|-----------|---------------|---------|
| **Rendimiento** | Cuántos kilómetros recorre cada litro en promedio. Más alto = mejor. | `3.2 Km/L` = cada litro rinde 3.2 km |
| **Costo / Km** | Cuánto cuesta operar cada kilómetro. Este es **el número más importante**. | `$195/km` = cada km cuesta $195 |
| **Gasto Total** | Cuánto se gastó en combustible en el periodo seleccionado. | `$4.200.000` |
| **Km Recorridos** | Total de kilómetros que movió la flota. | `21.500 km` |
| **Alertas** | Cuántas unidades están rindiendo mal (30% bajo el promedio). | `3 / 10` = 3 de 10 unidades en alerta |
| **Proyección 30d** | Cuánto se estima que se va a gastar el próximo mes, al ritmo actual. | `$4.800.000 (+12%)` |

### ¿Cómo se calcula el Costo/Km?

```
Costo/Km = Total pagado en combustible ÷ Total km recorridos
```

Ejemplo: Si un bus gastó $500.000 y recorrió 2.500 km → Costo/Km = $200

---

## Los 3 Problemas Detectados (Automático)

El sistema analiza todos los datos y te muestra los 3 problemas más urgentes. Cada problema tiene:

- **Qué pasó**: el dato concreto (ej: "EFGH-34 rinde 2.0 Km/L vs promedio de 3.1")
- **Por qué importa**: cuánto se desvía del promedio
- **Quién conduce**: el conductor asignado a esa unidad
- **Qué hacer**: la acción recomendada

### Tipos de problemas que detecta:

| Tipo | Qué busca | Ejemplo |
|------|-----------|---------|
| **Ineficiencia** | La unidad con peor rendimiento Km/L | "Rinde 2.0 vs promedio 3.1" |
| **Costo alto** | La unidad que más cuesta por km | "Cuesta $310/km vs promedio $195" |
| **Caída** | La unidad que más empeoró vs su historial | "Cayó 45% respecto a su promedio" |

---

## Ranking de Eficiencia

Tabla con **todas** las unidades, ordenadas de peor a mejor.

| Columna | Qué muestra |
|---------|-------------|
| **#** | Posición en el ranking. Los 3 primeros (peores) aparecen en rojo. |
| **Unidad** | Patente, marca y modelo |
| **Km/L** | Rendimiento: cuántos km por litro. Rojo = bajo promedio. Verde = bueno. |
| **Costo/Km** | Cuánto cuesta cada kilómetro operado |
| **Gasto** | Total gastado en el periodo |
| **Km** | Total recorrido en el periodo |

---

## Rendimiento por Conductor

Cruza **quién conduce** cada bus con **cómo rinde** ese bus. Así puedes medir el desempeño de cada conductor.

| Columna | Qué muestra |
|---------|-------------|
| **Conductor** | Nombre del conductor |
| **Unidades** | Cuántos buses tiene asignados |
| **Km/L** | Rendimiento promedio de sus buses |
| **Costo/Km** | Cuánto cuesta operar sus rutas |
| **Gasto** | Total que gastó en combustible |
| **Km** | Total que recorrió |

⚠ Si un conductor aparece en **rojo**, está 30% bajo el promedio de la flota.

---

## Comparativa de Gemelas

Compara buses **del mismo modelo y año** entre sí. Si son idénticos, deberían rendir parecido.

- **Δ 5%**: Normal, poca diferencia.
- **Δ 15%**: Hay que revisar. Puede ser el conductor, la ruta o un problema mecánico.
- **Δ >30%**: Alerta roja. Investigar urgente.

### ¿Para qué sirve?

Si tienes 3 buses Volvo B290R 2021 y uno rinde 2.8 Km/L mientras los otros rinden 3.3, algo está mal con ese bus específico.

---

## Tendencia Semanal

Gráfico que muestra el rendimiento Km/L **semana a semana** para una unidad.

- **Línea amarilla sólida**: rendimiento semanal
- **Línea punteada amarilla**: promedio histórico de esa unidad
- **Zona roja**: umbral de alerta (-30% del promedio)
- **Puntos rojos**: semanas donde cayó bajo el umbral

### ¿Para qué sirve?

Si ves que en la semana 3 de Enero el rendimiento cayó, puedes investigar qué pasó esa semana: ¿cambio de conductor? ¿ruta distinta? ¿problema mecánico?

---

## Filtros de Fecha

Arriba del todo puedes seleccionar el periodo que quieres analizar.

- **Desde / Hasta**: selecciona cualquier rango de fechas
- **Presets rápidos**: Esta semana, Semana pasada, Este mes, Mes pasado, 3 meses, Este año
- **vs anterior**: al activarlo, compara el periodo actual con el periodo anterior de igual duración

### Ejemplo práctico

Seleccionas "Este mes" (Marzo) y activas "vs anterior". Verás:
- Gasto Marzo: $4.200.000
- Gasto Febrero: $3.800.000
- Variación: +11%

---

## Alertas de Estanque Fantasma

Si un conductor intenta cargar **más litros que la capacidad del estanque** del bus, el sistema genera una alerta automática.

Ejemplo: Bus con estanque de 400 litros, conductor intenta cargar 480 → Alerta.

Puedes marcar la alerta como "Resuelta" cuando la investigues.

---

## Proyección Mensual

Calcula cuánto se gastaría en los próximos 30 días si se mantiene el ritmo actual.

```
Proyección = (Gasto del periodo ÷ Días del periodo) × 30 días
```

La variación muestra si estamos gastando más o menos que el mes anterior.

---

## Glosario

| Término | Significado |
|---------|-------------|
| **Km/L** | Kilómetros por litro. Medida de eficiencia del motor. |
| **Costo/Km** | Pesos chilenos gastados por cada kilómetro recorrido. |
| **Gemelas** | Unidades del mismo modelo, marca y año. |
| **Estanque Fantasma** | Intento de cargar más combustible que la capacidad del tanque. |
| **Umbral -30%** | Si una unidad rinde 30% peor que su promedio, se activa alerta. |
| **Proyección** | Estimación de gasto futuro basado en el ritmo actual. |

---

## Preguntas Frecuentes

**¿De dónde salen los datos?**
De las cargas de combustible que los conductores registran en el sistema operativo (patente, km, litros, precio).

**¿Qué pasa si un conductor no registra el precio?**
El Costo/Km no se calcula para esa carga. Los registros sin precio se ignoran en ese cálculo.

**¿Puedo ver datos de hace 6 meses?**
Sí, usa el filtro "Desde / Hasta" para cualquier rango.

**¿Por qué una unidad tiene "—" en Costo/Km?**
Porque no se registró precio en sus cargas de combustible.

**¿Cómo se asigna un conductor a un bus?**
En el módulo de Usuarios → seleccionar el conductor → botón "Flota" → asignar buses.
