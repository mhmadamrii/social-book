"use server";

import streamServerClient from "~/lib/stream";

export async function deleteAllStreamChatUsers(users: string[]) {
  try {
    const res = await streamServerClient.deleteUsers(users);
    console.log("res", res);
    return res;
  } catch (error) {
    console.log(error);
  }
}
