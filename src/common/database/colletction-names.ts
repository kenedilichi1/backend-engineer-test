export const CollectionNames = {} as const;

type CollectionNamesType = typeof CollectionNames;

export type CollectionNames = CollectionNamesType[keyof CollectionNamesType];
