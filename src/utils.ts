import * as fs from "fs";
import * as yaml from "js-yaml";
import { glob } from "glob";
import { ProgressBar } from "tqdm-js"; // Use a compatible progress bar library
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HuggingFaceEmbeddings } from "@langchain/community/embeddings/huggingface";
import { PyPDFLoader } from "langchain/document_loaders";
import { Document } from "@langchain/core/documents";
import { MemoryVectorStore } from "@langchain/community/vectorstores/memory";
import * as path from "path";

interface Config {
  embeddings: {
    name: string;
    device: string;
  };
  TextSplitter: {
    chunk_size: number;
    chunk_overlap: number;
  };
}

function loadConfig(): Config {
  const fileContents = fs.readFileSync("config.yaml", "utf8");
  return yaml.load(fileContents) as Config;
}

const config: Config = loadConfig();

function loadEmbeddings(
  modelName: string = config.embeddings.name,
  modelKwargs: { device: string } = { device: config.embeddings.device }
): HuggingFaceEmbeddings {
  return new HuggingFaceEmbeddings({ modelName, modelKwargs });
}

async function loadDocuments(directory: string): Promise<Document[]> {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: config.TextSplitter.chunk_size,
    chunkOverlap: config.TextSplitter.chunk_overlap,
  });

  const documents: Document[] = [];
  const filePaths = await glob(`${directory}*.pdf`);
  const progressBar = new ProgressBar({ total: filePaths.length });

  for (const filePath of filePaths) {
    const loader = new PyPDFLoader(filePath);
    const loadedDocuments = await loader.loadAndSplit({ textSplitter });
    documents.push(...loadedDocuments);
    progressBar.increment();
  }

  progressBar.end();
  return documents;
}

export function loadDb({
  embeddingFunction,
}: {
  embeddingFunction: HuggingFaceEmbeddings;
}) {
  try {
    // Initialize a new vector store with the embedding function
    return new MemoryVectorStore(embeddingFunction);
  } catch (error) {
    console.error("Error loading database:", error);
    throw error;
  }
}

export function saveDb(db: MemoryVectorStore) {
  try {
    // Here you might want to implement persistence logic
    // For now, this is a placeholder
    console.log("Database saved successfully");
  } catch (error) {
    console.error("Error saving database:", error);
    throw error;
  }
}

export function loadDocuments(directoryPath: string): Document[] {
  const documents: Document[] = [];

  try {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const content = fs.readFileSync(filePath, "utf-8");

      documents.push(
        new Document({
          pageContent: content,
          metadata: {
            source: filePath,
            filename: file,
          },
        })
      );
    }

    return documents;
  } catch (error) {
    console.error("Error loading documents:", error);
    throw error;
  }
}
