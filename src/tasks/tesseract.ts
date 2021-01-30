import { createWorker, ImageLike } from "tesseract.js";
import { Meme } from "./../models/meme/Entity/Meme.entity";

const worker = createWorker({
  errorHandler: (m) => console.log(m),
});

(async () => {
  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
})();

const doOCR = async (image: ImageLike) => {
  const { data } = await worker.recognize(image);
  return data.text;
};

export const memeOCR = async () => {
  const memes = await Meme.find({ where: { ocrText: null } });
  await Promise.all(
    memes.map(async (meme) => {
      meme.ocrText = await doOCR(meme.url);
    })
  );
  Meme.save(memes);
};
