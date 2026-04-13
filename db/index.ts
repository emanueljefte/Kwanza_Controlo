import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema"; // Importa todas as tabelas

const expoDb = openDatabaseSync("finance_app.db");

export const db = drizzle(expoDb, { schema });
