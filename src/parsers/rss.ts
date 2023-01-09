import { FeedItem, TextNode } from "feedParser";
import { DateTime } from "luxon";

export const isRss = (root: any): root is RssFeed => root.rss !== undefined;
// refs: https://validator.w3.org/feed/docs/rss2.html
export const RSS_ARRAY_ATTRIBUTES = ["rss.channel.item"];
type RssFeed = {
  rss: {
    channel: {
      item: Array<RssItem>,
      image?: {
        url: TextNode,
      }
    }
  }
}
type RssItem = {
  guid: TextNode,
  title: TextNode,
  pubDate?: TextNode,
  description?: TextNode,
  link?: TextNode,
}

export const parseRss = (root: RssFeed): Array<FeedItem> => {
  const channel = root.rss.channel;
  const items = channel.item;
  const logo = channel.image?.url["#text"];

  return items.map(rssItemToFeedItem).map(item => ({...item, logo}));
}
const rssItemToFeedItem = (element: RssItem):FeedItem => {
  const id = element.guid["#text"];
  const title = element.title["#text"];
  const pubDate = element.pubDate?.["#text"];
  const publishDate = pubDate != undefined ? DateTime.fromRFC2822(pubDate) : undefined;
  const description = element.description?.["#text"];
  const link = element.link?.["#text"];
  
  return {
    id,
    title,
    description,
    publishDate,
    link,
  }
}
