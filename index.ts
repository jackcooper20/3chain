import { FAISS } from 'your-faiss-wrapper';
import { loadDocuments, saveDB, loadEmbeddings } from './utils';

const embeddingFunction = loadEmbeddings();
const documents = loadDocuments("data/");

const db = FAISS.fromDocuments(documents, embeddingFunction);
console.log("Index Created");

saveDB(db);

const searchResults = db.similaritySearch("ISO/IEC 27001 standard");
console.log(searchResults);

