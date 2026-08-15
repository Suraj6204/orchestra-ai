// import { S3Client} from "@aws-sdk/client-s3";

// export const s3=new S3Client({
//     region:process.env.AWS_REGION,
//     credentials:{
//         accessKeyId:process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey:process.env.AWS_SECRET_KEY
//     }
// })

import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

export const s3 = createClient(supabaseUrl, supabaseKey);
