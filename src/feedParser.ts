import { ATOM_ARRAY_ATTRIBUTES, isAtom, parseAtom } from "parsers/atom";
import { RSS_ARRAY_ATTRIBUTES, isRss, parseRss } from "parsers/rss";
import { X2jOptions, XMLParser } from "fast-xml-parser";
import { DateTime } from "luxon";
import fetch from "node-fetch";

export type FeedItem = {
  id: string;
  title: string;
  publishDate?: DateTime;
  description?: string;
  link?: string;
  logo?: string;
};
export type TextNode<T = {"text": string}> = {
  [K in keyof T as K extends string ? `#${K}` : never]: T[K]
}
export type AttributeNode<T> = {
  [K in keyof T as K extends string ? `@${K}` : never]: T[K]
};

class NotFeedError extends Error {}

const parserOptions: Partial<X2jOptions> = {
  ignoreAttributes: false,
  alwaysCreateTextNode: true,
  attributeNamePrefix: "@",
  isArray: (_, jpath) => {
    if (ATOM_ARRAY_ATTRIBUTES.indexOf(jpath) !== -1 || RSS_ARRAY_ATTRIBUTES.indexOf(jpath) !== -1) return true;
    return false;
  },
};

export const parseFeed = async (url: string) => {
  const xml = await (await fetch(url)).text();
  const parser = new XMLParser(parserOptions);
  const document = parser.parse(xml);

  if(isAtom(document)) {
    return parseAtom(document);
  } else if(isRss(document)) {
    return parseRss(document) || [];
  } else {
    throw new NotFeedError(`Can't parse. Is it RSS/ATOM ?: ${url}`);
  }
}


