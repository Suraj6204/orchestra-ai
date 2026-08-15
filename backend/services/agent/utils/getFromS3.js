// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { s3 } from "../config/s3.js";
// import { GetObjectCommand } from "@aws-sdk/client-s3";

// export const getFromS3=async (filename,expiresIn=600)=>{
//   return await getSignedUrl(
//     s3,
//     new GetObjectCommand({
//         Bucket:process.env.AWS_BUCKET_NAME,
//         Key:filename
//     }
//     ),
//     {expiresIn}
//   )
// }

import { s3 } from "../config/s3.js";

export const getFromS3 = (filename) => {
  const bucket = process.env.SUPABASE_BUCKET_NAME;
  const safeFilename = String(filename || "").replace(/^\/+/, "");

  const { data, error } = s3.storage
    .from(bucket)
    .getPublicUrl(safeFilename);

  if (error) {
    throw new Error(error.message || "Supabase public URL generation failed");
  }

  return data.publicUrl;
};
