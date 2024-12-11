declare interface Config {
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
