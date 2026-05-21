import { PrismaClient } from "@prisma/client";

import { getPrismaDatasourceOverrideUrl } from "../lib/prisma-runtime-url";

const datasourceOverrideUrl = getPrismaDatasourceOverrideUrl();
const prisma = new PrismaClient(
  datasourceOverrideUrl ? { datasources: { db: { url: datasourceOverrideUrl } } } : undefined,
);

async function main() {
  await prisma.allowedUser.upsert({
    where: { email: "hordhn@gmail.com" },
    create: {
      email: "hordhn@gmail.com",
      fullName: "Administrador inicial",
      role: "admin",
      isActive: true,
    },
    update: { role: "admin", isActive: true },
  });

  await prisma.member.deleteMany();

  const membersData = [
    {
      fullName: "María Fernanda Reyes",
      company: "NovaRetail HN",
      position: "Directora General",
      email: "mreyes@novaretail.hn",
      whatsapp: "+504 3177-2201",
      department: "Cortés",
      municipality: "San Pedro Sula",
      linkedin: "https://www.linkedin.com/in/mariafernandareyes",
      website: "https://novaretail.hn",
      expertiseAreas: ["Ecommerce", "Marketing Digital", "Ventas", "Logística"],
      contributionTypes: ["Capacitaciones", "Networking", "Charlas", "Alianzas"],
      professionalSummary:
        "Trayectoria de más de doce años en retail digital, canales omnicanal y operaciones comerciales en mercados de Centroamérica, con énfasis en adopción tecnológica en cadenas medianas.",
      committeeContribution:
        "Disponibilidad para coordinar talleres prácticos de comercio electrónico y compartir plantillas de diagnóstico comercial orientadas a mipymes manufactureras y de servicios.",
      committeeExpectation:
        "Articular esfuerzos con socios logísticos y financieros que permitan escalar iniciativas de digitalización comercial con criterios de medición compartidos.",
      consent: true,
    },
    {
      fullName: "Carlos Osorto",
      company: "CiberAlto",
      position: "Consultor senior en ciberseguridad",
      email: "cosorto@ciberalto.com",
      whatsapp: "+504 8882-4410",
      department: "Francisco Morazán",
      municipality: "Distrito Central",
      linkedin: "https://www.linkedin.com/in/carlos-osorto",
      website: null,
      expertiseAreas: ["Ciberseguridad", "Software", "Legal/Fiscal"],
      contributionTypes: ["Diagnóstico digital", "Capacitaciones", "Apoyo legal/fiscal", "Charlas"],
      professionalSummary:
        "Especialización en endurecimiento de infraestructura, políticas de acceso y marcos de cumplimiento para organizaciones con operación digital sensible.",
      committeeContribution:
        "Apoyo en evaluaciones de riesgo, guías de buenas prácticas y lineamientos para respuesta a incidentes en mipymes en etapa de maduración digital.",
      committeeExpectation:
        "Visibilizar estándares mínimos de seguridad alineados al contexto hondureño y coordinar con academia y sector público cuando corresponda.",
      consent: true,
    },
    {
      fullName: "Laura Pineda",
      company: "FinLab Centroamérica",
      position: "Directora de innovación",
      email: "lpineda@finlabca.com",
      whatsapp: "+504 9771-8890",
      department: "Atlántida",
      municipality: "La Ceiba",
      linkedin: null,
      website: "https://finlabca.com",
      expertiseAreas: ["Fintech", "Finanzas", "Transformación Digital"],
      contributionTypes: ["Financiamiento", "Mentorías", "Diagnóstico digital", "Alianzas"],
      professionalSummary:
        "Experiencia combinada en sector financiero y diseño de productos digitales de pagos e inclusión financiera en segmentos urbanos y periurbanos.",
      committeeContribution:
        "Facilitar vínculos con instituciones financieras y esquemas de evaluación basados en datos para mipymes en transición digital.",
      committeeExpectation:
        "Impulsar pilotos medibles con indicadores claros de adopción y supervisión de riesgo, alineados a la agenda del comité.",
      consent: true,
    },
    {
      fullName: "Javier Mejía",
      company: "EduDigital HN",
      position: "Director académico",
      email: "jmejia@edudigital.hn",
      whatsapp: "+504 3220-5566",
      department: "Comayagua",
      municipality: "Comayagua",
      linkedin: "https://www.linkedin.com/in/javier-mejia-edu",
      website: "https://edudigital.hn",
      expertiseAreas: ["Educación", "Marketing Digital", "Software"],
      contributionTypes: ["Capacitaciones", "Charlas", "Implementación tecnológica"],
      professionalSummary:
        "Diseño de rutas de aprendizaje híbrido para equipos directivos y operativos, con plataformas ligeras y contenidos accesibles desde dispositivos móviles.",
      committeeContribution:
        "Colaboración en microcursos y esquemas de certificación interna para voluntariado del comité y mipymes aliadas.",
      committeeExpectation:
        "Alinear contenidos con políticas educativas locales y fortalecer comunidades de práctica en torno a la transformación digital.",
      consent: true,
    },
    {
      fullName: "Andrea Núñez",
      company: "LogisSur",
      position: "Gerente de operaciones",
      email: "anunez@logissur.hn",
      whatsapp: "+504 3399-1208",
      department: "Choluteca",
      municipality: "Choluteca",
      linkedin: "https://www.linkedin.com/in/andrea-nunez-logistica",
      website: null,
      expertiseAreas: ["Logística", "Automatización", "Ventas"],
      contributionTypes: ["Networking", "Diagnóstico digital", "Implementación tecnológica", "Alianzas"],
      professionalSummary:
        "Optimización de cadenas de suministro con telemetría, tableros operativos y coordinación con redes de transporte regional en el sur del país.",
      committeeContribution:
        "Apoyo en mapeo de cuellos de botella logísticos en mipymes y propuestas de automatización de bajo costo con impacto operativo medible.",
      committeeExpectation:
        "Integrar casos de uso al tablero del comité y coordinar pilotos con gremios sectoriales cuando se definan líneas de trabajo.",
      consent: true,
    },
    {
      fullName: "Ricardo Fúnez",
      company: "LexNova",
      position: "Socio",
      email: "rfunez@lexnova.hn",
      whatsapp: "+504 2244-9033",
      department: "Santa Bárbara",
      municipality: "Santa Bárbara",
      linkedin: null,
      website: "https://lexnova.hn",
      expertiseAreas: ["Legal/Fiscal", "Finanzas", "Fintech"],
      contributionTypes: ["Apoyo legal/fiscal", "Charlas", "Mentorías"],
      professionalSummary:
        "Asesoría en constitución de empresas, contratos tecnológicos y esquemas de facturación electrónica para organizaciones en crecimiento.",
      committeeContribution:
        "Sesiones de claridad legal en términos de servicio, privacidad de datos y cumplimiento fiscal aplicado al comercio digital.",
      committeeExpectation:
        "Definir canales formales para consultas recurrentes de mipymes sin saturar la operación diaria del comité.",
      consent: true,
    },
    {
      fullName: "Sofía Matamoros",
      company: "BrightAI Lempira",
      position: "Responsable de IA aplicada",
      email: "smatamoros@brightai-lempira.org",
      whatsapp: "+504 2555-7712",
      department: "Lempira",
      municipality: "Gracias",
      linkedin: "https://www.linkedin.com/in/sofia-matamoros-ai",
      website: "https://brightai-lempira.org",
      expertiseAreas: ["Inteligencia Artificial", "Software", "Educación"],
      contributionTypes: ["Capacitaciones", "Charlas", "Mentorías", "Diagnóstico digital"],
      professionalSummary:
        "Enfoque en asistentes y modelos livianos para productividad administrativa en mipymes rurales con conectividad intermitente.",
      committeeContribution:
        "Demostraciones accesibles de IA generativa con gobernanza básica y material de apoyo para equipos sin perfil técnico profundo.",
      committeeExpectation:
        "Retroalimentación del comité sobre casos de uso responsables y escalables en territorios con menor densidad digital.",
      consent: true,
    },
    {
      fullName: "Héctor Ballesteros",
      company: "LiSalud",
      position: "Director de producto y plataformas",
      email: "hector.ballesteros@lisalud.hn",
      whatsapp: "+504 9990-1100",
      department: "Comayagua",
      municipality: "Siguatepeque",
      linkedin: "https://www.linkedin.com/in/hector-ballesteros-lisalud",
      website: "https://lisalud.hn",
      expertiseAreas: ["Software", "Inteligencia Artificial", "Automatización", "Transformación Digital"],
      contributionTypes: ["Diagnóstico digital", "Implementación tecnológica", "Mentorías", "Networking"],
      professionalSummary:
        "Liderazgo en evolución de productos SaaS en salud, integración de plataformas empresariales y ecosistemas de datos, con aplicación de inteligencia artificial a flujos operativos y programas de transformación digital responsables.",
      committeeContribution:
        "Disponibilidad para apoyar en arquitectura de integraciones, priorización de roadmaps digitales y acompañamiento técnico en despliegues conjuntos con mipymes y aliados del comité.",
      committeeExpectation:
        "Contribuir a una visión compartida de transformación digital sectorial y a espacios de co-creación con actores públicos y privados bajo criterios institucionales del comité.",
      consent: true,
    },
  ];

  for (const data of membersData) {
    await prisma.member.create({ data });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
