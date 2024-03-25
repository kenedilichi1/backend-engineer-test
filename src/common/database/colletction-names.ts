export const CollectionNames = {
  User: "USERS",
  Product: "PRODUCTS",
} as const;

type CollectionNamesType = typeof CollectionNames;

export type CollectionNames = CollectionNamesType[keyof CollectionNamesType];
