// import { PutObjectCommand } from "@aws-sdk/client-s3"
// import { s3 } from "../config/s3.js"

// export const uploadToS3=async (filename,buffer,contentType)=>{
//  await s3.send(
//     new PutObjectCommand({
//         Bucket:process.env.AWS_BUCKET_NAME,
//         Body:buffer,
//         Key:filename,
//         ContentType:contentType
//     })
//  )
//  return filename
// }

import { s3 } from "../config/s3.js";

export const uploadToS3 = async (filename, buffer, contentType) => {
  const bucket = process.env.SUPABASE_BUCKET_NAME;
  const safeFilename = String(filename || "").replace(/^\/+/, "");

  const { data, error } = await s3.storage
    .from(bucket)
    .upload(safeFilename, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error("Supabase Upload Error:", error);
    throw new Error(error.message || "Supabase upload failed");
  }

  return data?.path || safeFilename;
};
