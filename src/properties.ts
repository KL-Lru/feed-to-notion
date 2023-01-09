export const getProperties = () => {
  const env = process.env;

  return {
    TOKEN: env.NOTION_TOKEN,
    DATABASE_ID: env.DATABASE_ID,
  }
}
