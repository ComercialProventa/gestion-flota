# Centro de Inteligencia — Guía para Gerencia

## ¿Qué es?

El Centro de Inteligencia es el panel donde el sistema analiza automáticamente los datos operacionales de la flota y presenta indicadores clave, alertas y tendencias para tomar decisiones informadas.

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
- **Flota:** Si tiene más de un tipo de unidad (ej: buses, minibuses), puede filtrar para ver solo una flota específica.

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

### Indicador Principal: CPK (Costo por Kilómetro)

| Campo | Qué significa |
|-------|---------------|
| **Modelo** | Marca y medida del neumático. |
| **Rend. Medio** | Kilómetros reales promedio que duró antes de ser reciclado. |
| **Precio Prom.** | Precio promedio de compra de ese modelo. |
| **CPK ($/Km)** | Costo por kilómetro = Precio / Km real recorrido. **Más bajo = más rentable.** |
| **Rentabilidad** | Clasificación automática: buena (duró ≥95% de lo esperado), regular, o mala (duró ≤70%). |

### ¿Cómo usarlo?

1. El modelo con el **CPK más bajo** es el más rentable a largo plazo.
2. Si un modelo tiene rentabilidad **"mala"**, considere cambiar de proveedor o marca.
3. Compare modelos similares para futuras compras.

---

## Resumen Rápido

| Módulo | Para qué sirve | Decisión que permite |
|--------|----------------|---------------------|
| **Combustible** | Monitorear eficiencia y gasto de combustible | Detectar unidades problemáticas, optimizar rutas, planificar gasto |
| **Neumáticos** | Evaluar qué modelos de neumático son más rentables | Decidir qué marca/modelo comprar, identificar proveedores malos |

---

*Los datos se actualizan automáticamente con cada registro operativo. Los filtros de fecha y flota permiten analizar periodos y unidades específicas.*
