import { AttributeNode as NodeAttributes, FeedItem, TextNode } from "feedParser";
import "luxon";
import { DateTime } from "luxon";

// refs: https://www.rfc-editor.org/rfc/rfc4287
export const ATOM_ARRAY_ATTRIBUTES = ["feed.entry", "feed.entry.link"]
type AtomFeed = {
  feed: {
    entry: Array<AtomEntry> ,
    logo: TextNode,
  }
}
type AtomEntry = {
  id: TextNode,
  title: TextNode & NodeAttributes<{type: string}>,
  published?: TextNode,
  updated: TextNode,
  content?: AtomContent,
  link?: Array<AtomLink>
}
type AtomContent = TextNode & NodeAttributes<{
  type?: "text" | "html" | "xhtml",
  src?: string,
}>
type AtomLink = NodeAttributes<{
  href: string,
  rel?: "alternate" | "related" | "self" | "enclosure" | "via"
}>;

export const isAtom = (root: any): root is AtomFeed => root.feed !== undefined;
export const parseAtom = (root: AtomFeed): Array<FeedItem> => {
  const entries = root.feed.entry;
  const logo = root.feed.logo?.["#text"];

  return entries.map(atomEntryToFeedItem).map(entry => ({...entry, logo}));
}
const atomEntryToFeedItem = (element: AtomEntry): FeedItem => {
  const id = element.id["#text"];
  const title = element.title["#text"];
  const publishDate = DateTime.fromISO(element.published?.["#text"] || element.updated["#text"]);
  const description = getAtomContent(element);
  const link = getAtomLink(element);

  return {
    id,
    title,
    description,
    publishDate,
    link,
  }
}
const getAtomContent = (element: AtomEntry): string | undefined => {
  if (element.content === undefined) {return undefined;}
  return element.content["#text"];
}
const getAtomLink = (element: AtomEntry): string | undefined => {
  if (element.content != undefined && element.content["@src"] != undefined) {
    return element.content["@src"];
  }
  if (element.link === undefined) {return undefined;}

  const alternates = element.link.filter(link => ["alternate", undefined].includes(link["@rel"]));
  return alternates[0]?.["@href"];
}
