import { FAQS } from "./faqData.js";

export let faqEmbeddings = [];

export async function buildFAQEmbeddings() {

    faqEmbeddings = [];

    for (const faq of FAQS) {

        const output =
            await window.featureExtractor(
                faq.q + " " + faq.a,
                {
                    pooling: 'mean',
                    normalize: true
                }
            );

        faqEmbeddings.push(output.data);
    }

    console.log("FAQ embeddings ready");
}

function embeddingCosine(a, b) {

    let dot = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
    }

    return dot;
}

export async function semanticSearch(query) {

    const output =
        await window.featureExtractor(
            query,
            {
                pooling: 'mean',
                normalize: true
            }
        );

    const queryEmbedding = output.data;

    let bestScore = -1;
    let bestFAQ = null;

    for (let i = 0; i < faqEmbeddings.length; i++) {

        const score =
            embeddingCosine(
                queryEmbedding,
                faqEmbeddings[i]
            );

        if (score > bestScore) {

            bestScore = score;
            bestFAQ = FAQS[i];
        }
    }

    if (bestScore < 0.35)
        return null;

    return {
        faq: bestFAQ,
        score: bestScore
    };
}
