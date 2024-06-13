export default {
  schema: "./src/schema.ts",
  out: "./drizzle/migrations",
  driver: "d1-http",
  dialect: "sqlite",
};
