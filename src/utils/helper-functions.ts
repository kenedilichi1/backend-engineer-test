import { ObjectId } from "mongodb";
import { Sort } from "mongodb";
import {
  IPagerFirst,
  IPagerNext,
  IPagerPrevious,
  PagerAction,
} from "../common/interface/pagination";

export const toObjectId = (id: string): ObjectId => new ObjectId(id);

export async function paginationHelper(
  paginationData: IPagerFirst | IPagerNext | IPagerPrevious,
  query: Record<string, any>
) {
  const sort: Sort = { _id: -1 };

  const after = paginationData.action === PagerAction.Next;
  const before = paginationData.action === PagerAction.Previous;
  if (after) {
    query["_id"] = { $lt: toObjectId(paginationData.after) };
  }

  if (before) {
    query["_id"] = { $gt: toObjectId(paginationData.before) };
    sort._id = 1;
  }

  return {
    query,
    sort,
  };
}
