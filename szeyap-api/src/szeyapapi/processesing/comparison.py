from sentence_transformers import SentenceTransformer
import torch
import logging
logger = logging.getLogger("szeyapapi")

class Comparison:
    def __init__(self, model_type: str):
        self.model = SentenceTransformer(model_type)

    def compare(self, data1: str, data2: str):
        embeddings1 = self.model.encode(data1)
        embeddings2 = self.model.encode(data2)
        similarity = self.model.similarity(embeddings1, embeddings2)
        print(similarity)
        return similarity

    def encode_data(self, data: str):
        return self.model.encode(data)

    def compare_encoded(self, target, references):
        total = 0
        for ref in references:
            total += self.model.similarity(target, ref).item()
        return total / len(references)

    def calc_simularities(self, target, refs):
        target = self.encode_data(target)
        return self.model.similarity(target, refs).squeeze().tolist()


logging.info("Loading comparison model")
LANG_MODEL = Comparison("paraphrase-multilingual-MiniLM-L12-v2")
