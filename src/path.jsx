const path = {};

path.admin = [
  { path: "/admin", alias: "Inicio", principal: true },
  { path: "/sindicatos", alias: "Sindicatos", principal: true },
  { path: "/sindicatos/:id", alias: "Sindicato", principal: false },
  {
    path: "/delegaciones",
    alias: "Delegaciones",
    principal: true,
  },
  {
    path: "/delegaciones/:id",
    alias: "Delegacion",
    principal: false,
  },
  {
    path: "/delegaciones/:id/:optica",
    alias: "Optica",
    principal: false,
  },
  { path: "/armazones", alias: "Armazones", principal: true },
  { path: "/armazones/:id", alias: "Armazon", principal: false },
  { path: "/armazones/:id/stock", alias: "Armazones Stock", principal: false },
  { path: "/usuarios", alias: "Usuarios", principal: true },
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
];

export default path;
