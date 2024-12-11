import { HuggingFaceEmbeddings } from "langchain/embeddings/huggingface";
import { loadDocuments, loadDb, saveDb, loadEmbeddings } from "./utils";

async function main() {
  const db = loadDb({ embeddingFunction: loadEmbeddings() });
  const newDocuments = loadDocuments("new_document/");
  db.addDocuments(newDocuments);
  saveDb(db);
}

main().catch((error) => {
  console.error("Error:", error);
});

