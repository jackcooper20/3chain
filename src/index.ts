import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HuggingFaceEmbeddings } from "langchain/embeddings/huggingface";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { FaissStore } from "langchain/vectorstores/faiss";
import { Document } from "langchain/document";
import { glob } from "glob";
import * as yaml from "yaml";
import * as fs from "fs";
import ProgressBar from "progress";

interface Config {
  embeddings: {
    name: string;
    device: string;
  };
  TextSplitter: {
    chunk_size: number;
    chunk_overlap: number;
  };
  faiss_indexstore: {
    save_path: string;
    index_name: string;
  };
}

function loadConfig(): Config {
  const file = fs.readFileSync("config.yaml", "utf8");
  return yaml.parse(file) as Config;
}

const config = loadConfig();

async function loadEmbeddings(
  modelName: string = config.embeddings.name,
  modelKwargs: { device: string } = { device: config.embeddings.device }
): Promise<HuggingFaceEmbeddings> {
  return new HuggingFaceEmbeddings({
    modelName,
    modelKwargs,
  });
}

async function loadDocuments(directory: string): Promise<Document[]> {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: config.TextSplitter.chunk_size,
    chunkOverlap: config.TextSplitter.chunk_overlap,
  });

  const documents: Document[] = [];
  const files = await glob(directory + "*.pdf");

  const progressBar = new ProgressBar("Processing PDFs [:bar] :percent :etas", {
    complete: "=",
    incomplete: " ",
    width: 20,
    total: files.length,
  });

  for (const itemPath of files) {
    const loader = new PDFLoader(itemPath);
    const docs = await loader.loadAndSplit(textSplitter);
    documents.push(...docs);
    progressBar.tick();
  }

  return documents;
}

async function loadDb(
  embeddingFunction: HuggingFaceEmbeddings,
  savePath: string = config.faiss_indexstore.save_path,
  indexName: string = config.faiss_indexstore.index_name
): Promise<FaissStore> {
  return await FaissStore.load(savePath, embeddingFunction, { indexName });
}

async function saveDb(
  db: FaissStore,
  savePath: string = config.faiss_indexstore.save_path,
  indexName: string = config.faiss_indexstore.index_name
): Promise<void> {
  await db.save(savePath, indexName);
  console.log(`Saved db to ${savePath}${indexName}`);
}

export { loadConfig, loadEmbeddings, loadDocuments, loadDb, saveDb };
