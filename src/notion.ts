import { FeedItem } from "feedParser";
import {Client} from "@notionhq/client";
import { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";
import { getProperties } from "properties";
import sanitizeHTML from "sanitize-html";

const FeedItemToPage = (item: FeedItem): CreatePageParameters => {
  return { 
    parent: buildParent(),
    properties: buildProperties(item),
    children: buildChildren(item),
    ...buildCover(item),
  } as CreatePageParameters;
}
const buildParent = (): CreatePageParameters["parent"] => {
  const {DATABASE_ID} = getProperties();
  return {database_id: DATABASE_ID || "", type: "database_id" }
};
const buildProperties = (item: FeedItem): CreatePageParameters["properties"] => {
  let properties: CreatePageParameters["properties"] = {
    title: {
      title: [{text: {content: item.title}}],
    },
    id: {
      rich_text: [{text: {content: item.id}}],
    }
  };
  if (item.publishDate !== undefined) {
    properties = {
      ...properties,     
      published_date: {
        date: {
          start: item.publishDate.toISO(),
        },
      },
    };
  }
  if (item.link !== undefined) {
    properties = {
      ...properties,
      link: {
        url: item.link,
      }
    }
  }
  return properties;
}
const buildChildren = (item: FeedItem):CreatePageParameters["children"] => {
  const children: CreatePageParameters["children"] = [];
  if (item.link !== undefined) {
    children.push({
        type: "bookmark", 
        bookmark: {
          url: item.link,
        }
      }
    )
  }
  if (item.description !== undefined ) {
    for (const desc of sanitizeHTML(item.description, {allowedTags: []}).split(/\r?\n/).slice(0, 99)) {
      children.push({
        type: "paragraph",
        paragraph: {
          rich_text: [{
            text: {
              content: desc.substring(0, 2000),
            }
          }],
        }
      });  
    }
  }

  return children;
}
const buildCover = (item:FeedItem): Pick<CreatePageParameters, "cover">=> {
  if (item.logo !== undefined) {
    return {
      cover: {
        external: {
          url: item.logo,
        }
      }    
    }
  }
  return {};
}

export const createFeedPage = async (item: FeedItem) => {
  const {TOKEN } = getProperties();
  const client = new Client({auth: TOKEN || ""});
  const pageObj = FeedItemToPage(item);
  client.pages.create(pageObj);
}
export const isFeedPageExists = async (id: string) => {
  const {TOKEN, DATABASE_ID } = getProperties();
  const client = new Client({auth: TOKEN || ""});
  const response = await client.databases.query({
    database_id: DATABASE_ID || "",
    filter: {
      "and":[
        {
          property: "id",
          rich_text: {
            "equals": id,
          }
        }
      ]
    }
  });

  return response.results.length > 0;
}
