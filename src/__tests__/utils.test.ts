import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { glob } from 'glob';
import { HuggingFaceEmbeddings } from 'langchain/embeddings/huggingface';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PyPDFLoader } from 'langchain/document_loaders';
import { Document } from 'langchain/document';
import { loadConfig, loadEmbeddings, loadDocuments } from './path/to/your/module'; // Adjust path

jest.mock('fs');
jest.mock('yaml');
jest.mock('glob');
jest.mock('langchain/embeddings/huggingface');
jest.mock('langchain/text_splitter');
jest.mock('langchain/document_loaders');

describe('loadConfig', () => {
    it('should load and parse the YAML config file', () => {
        const mockConfig = {
            embeddings: { name: 'test-model', device: 'cpu' },
            TextSplitter: { chunk_size: 1000, chunk_overlap: 200 }
        };
        (fs.readFileSync as jest.Mock).mockReturnValue('yaml content');
        (yaml.load as jest.Mock).mockReturnValue(mockConfig);

        const config = loadConfig();

        expect(fs.readFileSync).toHaveBeenCalledWith('config.yaml', 'utf8');
        expect(yaml.load).toHaveBeenCalledWith('yaml content');
        expect(config).toEqual(mockConfig);
    });
});

describe('loadEmbeddings', () => {
    it('should return a HuggingFaceEmbeddings instance with the correct arguments', () => {
        const mockConfig = {
            embeddings: { name: 'test-model', device: 'cpu' },
            TextSplitter: { chunk_size: 1000, chunk_overlap: 200 }
        };
        (HuggingFaceEmbeddings as jest.Mock).mockImplementation(() => ({
            modelName: 'test-model',
            modelKwargs: { device: 'cpu' }
        }));

        const embeddings = loadEmbeddings(mockConfig.embeddings.name, { device: mockConfig.embeddings.device });

        expect(HuggingFaceEmbeddings).toHaveBeenCalledWith({
            modelName: 'test-model',
            modelKwargs: { device: 'cpu' }
        });
        expect(embeddings).toBeInstanceOf(HuggingFaceEmbeddings);
    });
});

describe('loadDocuments', () => {
    it('should load and split documents using the text splitter and progress bar', async () => {
        const mockConfig = {
            embeddings: { name: 'test-model', device: 'cpu' },
            TextSplitter: { chunk_size: 1000, chunk_overlap: 200 }
        };
        const mockFilePaths = ['file1.pdf', 'file2.pdf'];
        const mockDocuments = [new Document(), new Document()];
        (glob as jest.Mock).mockImplementation((pattern, callback) => callback(null, mockFilePaths));
        (PyPDFLoader.prototype.loadAndSplit as jest.Mock).mockResolvedValue(mockDocuments);
        const mockTextSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: mockConfig.TextSplitter.chunk_size,
            chunkOverlap: mockConfig.TextSplitter.chunk_overlap
        });
        jest.spyOn(RecursiveCharacterTextSplitter.prototype, 'constructor').mockReturnValue(mockTextSplitter);

        const documents = await loadDocuments('./test-dir/');

        expect(glob).toHaveBeenCalledWith('./test-dir/*.pdf', expect.any(Function));
        expect(PyPDFLoader.prototype.loadAndSplit).toHaveBeenCalledTimes(mockFilePaths.length);
        expect(documents).toEqual(mockDocuments);
    });
});
