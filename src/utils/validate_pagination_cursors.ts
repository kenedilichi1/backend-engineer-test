import { ObjectId } from "mongodb";
import {
  IPagerFirst,
  IPagerNext,
  IPagerPrevious,
  PagerAction,
} from "../common/interface/pagination";
import { PaginationInputSchema } from "../common/dtos";

export function normalizeLimit(limit: string): number {
  const l = parseInt(limit, 10);

  if (isNaN(l) || l <= 0 || l > 10) {
    return 10;
  }

  return l;
}

export function parsePaginationCursor(
  cursor: PaginationInputSchema
): IPagerFirst | IPagerNext | IPagerPrevious {
  // ...

  const limit = normalizeLimit(String(cursor.limit));

  const { before, after } = cursor;
  if ((!before && !after) || (before && after)) {
    return {
      action: PagerAction.First,
      limit,
    };
  }

  const isValidObjectId = String(new ObjectId(before)) === before;
  if (isValidObjectId && !after) {
    return {
      action: PagerAction.Previous,
      before: before as string,
      limit,
    };
  }

  return {
    action: PagerAction.Next,
    after: after as string,
    limit,
  };
}
