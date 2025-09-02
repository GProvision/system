const path = {};

path.admin = [
  { path: "/admin", alias: "Inicio", principal: true },
  { path: "/opticas", alias: "Opticas", principal: true },
  { path: "/opticas/:id", alias: "Optica", principal: false },
  { path: "/opticas/crear", alias: "Nueva Optica", principal: false },
  {
    path: "/opticas/:id/delegaciones",
    alias: "Delegaciones",
    principal: false,
  },
  {
    path: "/opticas/:id/:delegacion/sindicatos",
    alias: "Sindicatos",
    principal: false,
  },
  { path: "/armazones", alias: "Armazones", principal: true },
  { path: "/armazones/crear", alias: "Nuevo Armazon", principal: false },
  { path: "/armazones/stock", alias: "Armazones Stock", principal: false },
  { path: "/usuarios", alias: "Usuarios", principal: true },
  { path: "/admin/complementos", alias: "Complementos", principal: true },
];
path.boss = [
  { path: "/boss", alias: "inicio", principal: true },
  { path: "/reportes/opticas", alias: "Opticas", principal: true },
  { path: "/reportes/armazones", alias: "Armazones", principal: true },
  { path: "/reportes/sindicatos", alias: "Sindicatos", principal: true },
];
path.owner = [
  { path: "/owners", alias: "Inicio", principal: true },
  { path: "/fichas", alias: "Fichas", principal: true },
  { path: "/fichas/:id", alias: "Fichas Detalle", principal: false },
  { path: "/fichas/crear", alias: "Nueva Fichas ", principal: false },
  { path: "/fichas/reporte", alias: "Reportes", principal: true },
];
path.employed = [
  { path: "/fichas", alias: "Fichas", principal: true },
  { path: "/fichas/:id", alias: "Fichas Detalle", principal: false },
  { path: "/fichas/crear", alias: "Nueva Fichas ", principal: false },
  { path: "/armazones", alias: "Armazones", principal: true },
  { path: "/armazones/crear", alias: "Nuevo Armazon", principal: false },
  { path: "/armazones/stock", alias: "Armazones Stock", principal: false },
];

export default path;
