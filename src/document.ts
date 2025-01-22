import { loadDocuments, loadDb, saveDb, loadEmbeddings } from "./utils";

async function main() {
  const embeddings = loadEmbeddings();
  const db = loadDb({ embeddingFunction: embeddings });
  const newDocuments = loadDocuments("new_document/");
  await db.addDocuments(newDocuments);
  saveDb(db);
}

main().catch((error) => {
  console.error("Error:", error);
});
