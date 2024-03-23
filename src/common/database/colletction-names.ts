export const CollectionNames = {
  User: "USERS",
} as const;

type CollectionNamesType = typeof CollectionNames;

export type CollectionNames = CollectionNamesType[keyof CollectionNamesType];
