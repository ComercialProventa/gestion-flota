# Centro de Inteligencia — Guía para Gerencia

## ¿Qué es?

El Centro de Inteligencia es el panel donde el sistema analiza automáticamente los datos operacionales de la flota y presenta indicadores clave, alertas y tendencias para tomar decisiones informadas.

Acceso: Sidebar → **Centro de Inteligencia** (`/admin/inteligencia`)

---

## Módulo 1: Combustible

### ¿Qué monitorea?

El rendimiento de combustible de cada unidad de la flota, comparando consumo real vs esperado.

### Indicadores Clave (KPIs)

| Indicador | Qué significa |
|-----------|---------------|
| **Rendimiento (Km/L)** | Cuántos kilómetros recorre cada litro en promedio. Más alto = mejor eficiencia. |
| **Costo / Km** | Cuánto cuesta en pesos recorrer un kilómetro. Útil para comparar unidades. |
| **Gasto Total** | Gasto total en combustible para el periodo seleccionado. |
| **Km Recorridos** | Distancia total recorrida por la flota en el periodo. |
| **Alertas** | Unidades con rendimiento anormal (más del 30% bajo su promedio histórico). |
| **Proyección 30d** | Estimación del gasto para los próximos 30 días, con variación vs mes anterior. |

### Filtros Disponibles

- **Periodo:** Seleccione un rango de fechas o use los accesos rápidos (7 días, 30 días, este mes, 3 meses).
- **Flota:** Si tiene más de un tipo de unidad (ej: buses, camiones), puede filtrar para ver solo una flota específica.

### Tendencia Semanal

Muestra un gráfico del rendimiento (Km/L) de cada unidad por semana. Permite detectar unidades que están empeorando su rendimiento a lo largo del tiempo.

- **Línea punteada amarilla:** Promedio histórico de la unidad.
- **Zona roja:** Umbral crítico (30% bajo el promedio).
- **Puntos rojos:** Semanas donde la unidad estuvo bajo el umbral.

### Problemas Detectados

El sistema identifica automáticamente las 3 situaciones más críticas del periodo:
- Unidad más ineficiente (peor Km/L)
- Unidad más costosa por kilómetro
- Unidad con mayor caída de rendimiento

Cada problema incluye una acción recomendada.

### Ranking de Eficiencia

Tabla completa de todas las unidades ordenadas por rendimiento. Permite identificar rápidamente:
- Las unidades más eficientes (verde)
- Las unidades con alerta (rojo)
- El costo por kilómetro de cada una

### Secciones Adicionales (colapsables)

- **Rendimiento por Conductor:** Compara cómo rinden las unidades según el conductor asignado.
- **Comparativa Gemelas:** Compara unidades del mismo modelo/marca/año para detectar diferencias de rendimiento (posibles fallas mecánicas o manejo inadecuado).
- **Alertas de Estanque:** Detecta si alguien cargó más combustible del que el estanque puede contener (posible error de registro).

---

## Módulo 2: Neumáticos

### ¿Qué monitorea?

La rentabilidad real de cada modelo de neumático, calculando cuánto cuesta cada kilómetro recorrido con cada tipo de cubierta.

Solo se analizan neumáticos que ya completaron su ciclo de vida (estado: reciclaje) y que tienen precio de compra registrado.

### Ranking de Rentabilidad (CPK)

El indicador principal es el **CPK (Costo por Kilómetro)**:

| Campo | Qué significa |
|-------|---------------|
| **#** | Posición en el ranking (1 = más rentable). |
| **Modelo** | Marca y medida del neumático. |
| **Muestras** | Cantidad de neumáticos de este modelo que se analizaron. Más muestras = dato más confiable. |
| **Rend. Medio** | Kilómetros reales promedio que duró antes de ser reciclado. |
| **esperado** | Kilómetros que el fabricante estima que debería durar. |
| **Precio Prom.** | Precio promedio de compra de ese modelo (en pesos). |
| **CPK ($/Km)** | **Costo por kilómetro** = Precio promedio / Km real recorrido. **Más bajo = más rentable.** |
| **Rentabilidad** | Clasificación automática comparando km real vs esperado: |
| | **Buena** (verde): duró ≥95% de lo esperado |
| | **Regular** (amarillo): duró entre 71% y 94% |
| | **Mala** (rojo): duró ≤70% de lo esperado |

### Ejemplo práctico

Supongamos que tiene dos modelos 295/80R22.5:

| Modelo | Precio | Km Real | CPK | Rentabilidad |
|--------|--------|---------|-----|--------------|
| Michelin | $320.000 | 110.000 km | $2.91/km | Buena |
| Aeolus | $120.000 | 55.000 km | $2.18/km | Mala |

A primera vista, el Aeolus parece más barato ($2.18 vs $2.91/km). Pero si considera que para cubrir los mismos 110.000 km necesitaría comprar **2 neumáticos Aeolus** ($240.000 total), el Michelin sigue siendo más rentable.

### ¿Cómo usarlo para decisiones?

1. **Compras futuras:** El modelo con el **CPK más bajo** es el más rentable a largo plazo.
2. **Evaluar proveedores:** Si un modelo tiene rentabilidad **"mala"**, investigue si el problema es el producto o el precio.
3. **Presupuesto:** Use el CPK para proyectar costos reales de neumáticos por kilómetro recorrido.

---

## Módulo 3: Mantenimiento

### ¿Qué monitorea?

Anomalías en la frecuencia de cambios de repuestos y gasto mensual por unidad.

### Alertas de Frecuencia

Detecta piezas que se cambian más de 3 veces en 30 días en la misma unidad, lo que sugiere:
- Falla mecánica oculta
- Mala calidad del repuesto
- Error en el diagnóstico del mecánico

### Gasto Mensual por Unidad

Muestra el gasto total en repuestos y servicios de cada unidad durante el mes en curso, permitiendo identificar rápidamente la unidad que concentra los gastos operacionales.

---

## Resumen Rápido

| Módulo | Para qué sirve | Decisión que permite |
|--------|----------------|---------------------|
| **Combustible** | Monitorear eficiencia y gasto de combustible | Detectar unidades problemáticas, optimizar rutas, planificar gasto |
| **Neumáticos** | Evaluar qué modelos de neumático son más rentables | Decidir qué marca/modelo comprar, identificar proveedores malos |
| **Mantenimiento** | Detectar anomalías de repuestos y gasto | Identificar fallas recurrentes, controlar gasto operacional |

---

## Datos de prueba

El sistema incluye datos mock para poder evaluar los dashboards sin datos reales:

| Archivo | Contenido |
|---------|-----------|
| `supabase/migrations/016_mock_combustible.sql` | 10 buses, 10 conductores, ~750 cargas de combustible |
| `supabase/migrations/018_mock_neumaticos.sql` | ~70 neumáticos reciclados de 12 modelos diferentes |

Para ejecutar los mocks en Supabase, ejecute los archivos SQL en orden en el SQL Editor de su proyecto.

---

*Los datos se actualizan automáticamente con cada registro operativo. Los filtros de fecha y flota permiten analizar periodos y unidades específicas.*
