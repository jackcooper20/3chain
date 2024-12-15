import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { glob } from 'glob';
import { ProgressBar } from 'tqdm-js'; // Use a compatible progress bar library
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { HuggingFaceEmbeddings } from 'langchain/embeddings/huggingface';
import { PyPDFLoader } from 'langchain/document_loaders';
import { Document } from 'langchain/document';

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
    const fileContents = fs.readFileSync('config.yaml', 'utf8');
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
        chunkOverlap: config.TextSplitter.chunk_overlap
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
