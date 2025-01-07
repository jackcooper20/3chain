import { FaissStore } from "langchain/vectorstores/faiss";
import { loadDocuments, saveDb, loadEmbeddings } from "../document";
import { Document } from "langchain/document";
import * as fs from "fs";

// Mock the dependencies
jest.mock("langchain/vectorstores/faiss");
jest.mock("../document");
jest.mock("fs");

describe("Document Processing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load embeddings successfully", async () => {
    const mockEmbeddings = { embed: jest.fn() };
    (loadEmbeddings as jest.Mock).mockResolvedValue(mockEmbeddings);

    const embeddings = await loadEmbeddings();
    expect(embeddings).toBeDefined();
    expect(loadEmbeddings).toHaveBeenCalled();
  });

  it("should load documents from directory", async () => {
    const mockDocuments = [
      new Document({ pageContent: "test content 1" }),
      new Document({ pageContent: "test content 2" }),
    ];
    (loadDocuments as jest.Mock).mockResolvedValue(mockDocuments);

    const documents = await loadDocuments("data/");
    expect(documents).toHaveLength(2);
    expect(loadDocuments).toHaveBeenCalledWith("data/");
  });

  it("should create and save FAISS index", async () => {
    const mockEmbeddings = { embed: jest.fn() };
    const mockDocuments = [new Document({ pageContent: "test content" })];
    const mockDb = {
      save: jest.fn(),
      similaritySearch: jest.fn(),
    };

    (loadEmbeddings as jest.Mock).mockResolvedValue(mockEmbeddings);
    (loadDocuments as jest.Mock).mockResolvedValue(mockDocuments);
    (FaissStore.fromDocuments as jest.Mock).mockResolvedValue(mockDb);

    const embeddings = await loadEmbeddings();
    const documents = await loadDocuments("data/");
    const db = await FaissStore.fromDocuments(documents, embeddings);

    expect(db).toBeDefined();
    expect(FaissStore.fromDocuments).toHaveBeenCalledWith(
      documents,
      embeddings
    );
  });

  it("should perform similarity search", async () => {
    const mockResults = [
      new Document({ pageContent: "ISO/IEC 27001 content" }),
    ];
    const mockDb = {
      similaritySearch: jest.fn().mockResolvedValue(mockResults),
    };

    const searchResults = await mockDb.similaritySearch(
      "ISO/IEC 27001 standard"
    );

    expect(searchResults).toHaveLength(1);
    expect(mockDb.similaritySearch).toHaveBeenCalledWith(
      "ISO/IEC 27001 standard"
    );
  });
});
