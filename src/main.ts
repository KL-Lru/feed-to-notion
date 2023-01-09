import { parseFeed } from "feedParser";
import { createFeedPage, isFeedPageExists } from "notion";

export const main = async () => {
  for(const feed of FEEDS) {
    for (const item of await parseFeed(feed.url)) {
      if (!await isFeedPageExists(item.id)){
        await createFeedPage(item);
      }
    };
  }
}

