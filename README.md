
## Guía rápida para continuar el desarrollo

1. **Preparar entorno y contenedores:** Copia `.env.example` a `.env`, verifica las variables de entorno y ejecuta `docker compose up -d` para levantar PostgreSQL por servicio, Redis, RabbitMQ, LocalStack/S3 y Traefik.
2. **Levantar microservicios NestJS (`3001`–`3005`):** Inicia `auth-service` (`3001`), `courses-service` (`3002`), `progress-service` (`3003`), `certificates-service` (`3004`) y `payments-service` (`3005`) con CORS habilitado.
3. **Completar flujos de backend y eventos:** Revisa `assessments-service`, la emisión/almacenamiento de certificados y los eventos de avance/completado de cursos.
4. **Probar el frontend:** En `frontend`, ejecuta `npm install` y `npm run dev` (o `npm run build`), y revisa las vistas de **Cursos y Pagos** (`/`), **Mi Aula** (`/alumno`), **Certificados** (`/verificar`) y **Panel Profesor** (`/instructor`), junto con los temas claro natural y oscuro.
5. **Fase 5 — Pruebas y observabilidad:** Añade pruebas con Jest/integración y configura métricas/logs según los requisitos del equipo.
