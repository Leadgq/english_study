import type { WordList, WordQuery } from "@en/common/word";
import { serverApi } from "../index.ts";
import type { Response } from "../index.ts";

export const getWordBookList = (params: WordQuery) => {
  return serverApi.get("/word-book", { params }) as Promise<
    Response<WordList>
  >;
};
