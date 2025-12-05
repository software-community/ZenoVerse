import { Client } from "@gradio/client";
import { readFile } from "fs/promises";

export async function classifyImage(imagePath) {

  // Read the image file from disk
  const buffer = await readFile(imagePath);

  // Convert Buffer to Blob (for Gradio client)
  const imageBlob = new Blob([buffer], { type: "image/jpeg" });
              
  const client = await Client.connect("IotaCluster/ZenoVerse");
  const result = await client.predict("/_on_predict", {
    image: imageBlob,
    temperature: 1.5,
  });

  console.log(result.data);
  if (result.data[0].error == 'Only constellation or deep sky images are allowed.') {
    throw new Error('Only constellation or deep sky images are allowed.');
  }
  return { constellation: result.data[0].predicted_class, confidenceScore: result.data[0].confidence };
}
