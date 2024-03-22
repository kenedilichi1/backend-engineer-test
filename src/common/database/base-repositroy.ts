import {
  Collection,
  Db,
  Document,
  Filter,
  FindOptions,
  ObjectId,
  OptionalUnlessRequiredId,
  Sort,
  UpdateFilter,
  UpdateOptions,
  WithId,
} from "mongodb";
import { Exception } from "../../utils/error";
import { CollectionNames } from "./colletction-names";
import { EntityStatus, EntityStatusOptions } from "../dtos";

interface BaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
  entityStatus: EntityStatus;
}

export abstract class BaseRepository<T extends BaseDocument> {
  protected readonly collection: Collection<T>;

  constructor(
    readonly mongoInstance: Db,
    readonly collectionName: CollectionNames
  ) {
    this.collection = mongoInstance.collection(collectionName);
  }

  async fetch(
    query: Filter<T>,
    exclude: (keyof T)[],
    include: (keyof T)[],
    limit: number = 100,
    sort: Sort = { _id: -1 }
  ): Promise<WithId<T>[]> {
    let projection: Record<any, any> = {};
    const exclusionListSize = exclude.length;
    const includeListSize = include.length;

    if (includeListSize > 0) {
      for (let i = 0; i < includeListSize; i++) {
        projection[include[i]] = 1;
      }
      projection["_id"] = 1;
    }

    if (exclusionListSize > 0 && includeListSize === 0) {
      for (let i = 0; i < exclusionListSize; i++) {
        if (exclude[i] !== "_id") {
          projection[exclude[i]] = 0;
        }
      }
    }
    const opts: FindOptions = {
      projection: projection,
      limit,
      sort,
    };

    const r = await this.collection
      .find<WithId<T>>(query, opts)
      .sort({
        _id: -1,
      })
      .toArray();
    return r;
  }

  async fetchOne(
    query: Filter<T>,
    exclude: (keyof T)[],
    include: (keyof T)[]
  ): Promise<WithId<T> | null> {
    const projection: Record<any, any> = {};

    const exclusionListSize = exclude.length;
    const includeListSize = include.length;

    if (includeListSize > 0) {
      for (let i = 0; i < includeListSize; i++) {
        projection[include[i]] = 1;
      }
      projection["_id"] = 1;
    }

    if (exclusionListSize > 0 && includeListSize === 0) {
      for (let i = 0; i < exclusionListSize; i++) {
        if (exclude[i] !== "_id") {
          projection[exclude[i]] = 0;
        }
      }
    }
    const opts: FindOptions = {
      projection: projection,
    };

    const result = await this.collection.findOne<WithId<T>>(query, opts);

    return result;
  }

  async add(data: OptionalUnlessRequiredId<T>): Promise<ObjectId> {
    const { acknowledged, insertedId } = await this.collection.insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!acknowledged) {
      throw new Exception(
        "DATABASE_ERROR",
        "There was an error while writing entity to disk"
      );
    }

    return insertedId;
  }

  async update(
    filter: Filter<T>,
    data: UpdateFilter<T>["$set"],
    upsert = false
  ): Promise<boolean> {
    const opts: UpdateOptions = { upsert };

    // const entity = {...data, updatedAt: new Date()};

    const { modifiedCount, upsertedCount } = await this.collection.updateOne(
      filter,
      { $set: data },
      opts
    );

    if (upsert && (upsertedCount > 0 || modifiedCount > 0)) {
      return true;
    }
    if (modifiedCount > 0) {
      return true;
    }

    throw new Error("[update] Server error");
  }

  async delete(filter: Filter<T>): Promise<boolean> {
    return await this.update(
      filter,
      {
        "entityStatus.status": EntityStatusOptions.enum.DELETED,
        "entityStatus.at": new Date(),
      } as any,
      false
    );
  }

  async count(filter: Filter<T>): Promise<number> {
    return await this.collection.countDocuments(filter);
  }
}
