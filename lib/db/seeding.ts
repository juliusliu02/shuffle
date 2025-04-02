import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { articlesTable } from "@/lib/db/schema";

const db = drizzle(process.env.DB_FILE_NAME!);

async function main() {
  await db.insert(articlesTable).values({
    title: "A test article",
    body: "Donald Trump has promised to impose sweeping tariffs on imported goods on April 2nd, dubbing it “Liberation Day”. The car industry got a preview of what is in store a week earlier, when on March 26th America’s president said he would charge hefty levies on imported cars and parts. The aim is to restore carmaking to America. But it will come at a high cost. Raised prices will hit sales and reduce choice for American consumers. Carmakers, meanwhile, will be “liberated” from large chunks of their profits.\nTariffs on cars from Mexico and Canada had already been threatened and postponed in February, then again in March, so the news was no surprise. The speed of the tariffs’ implementation, and their size, however, are the “worst-case scenario”, according to Jefferies, a bank. Mr Trump had apparently held off only to give his administration more time to organise duties on imports from the rest of the world, too. He says the levies will be in place for the duration of his presidency.",
    source: "The Economist",
  });
}

main();
