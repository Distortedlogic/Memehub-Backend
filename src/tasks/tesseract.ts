import { createWorker, ImageLike } from "tesseract.js";
import { Meme } from "./../models/meme/Entity/Meme.entity";

const worker = createWorker({
  errorHandler: (m) => console.log(m),
});

(async () => {})();

const doOCR = async (image: ImageLike, worker: Tesseract.Worker) => {
  let tries = 0;

  while (tries < 5) {
    try {
      const { data } = await worker.recognize(image);
      return data.text;
    } catch (error) {
      tries++;
    }
  }
  return "OCR ERROR";
};

export const memeOCR = async () => {
  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  let notEmpty = true;
  while (notEmpty) {
    const memes = await Meme.find({ where: { ocrText: null }, take: 100 });
    if (memes.length === 0) {
      notEmpty = false;
    } else {
      await Promise.all(
        memes.map(async (meme) => {
          const text = await doOCR(meme.url, worker);
          if (text) {
            meme.ocrText = text;
          }
        })
      );
      Meme.save(memes);
    }
  }
};
