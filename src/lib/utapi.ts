"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteFiles(key: string) {
  try {
    const deleteFile = await utapi.deleteFiles([key]);
    console.log("deletefile", deleteFile);

    if (deleteFile.success) {
      return {
        success: true,
      };
    }
  } catch (error) {
    console.log(error);
  }
}
