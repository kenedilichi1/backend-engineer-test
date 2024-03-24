export interface PaginationCursor {
	before: string;
	after: string;
	hasNext: boolean;
	hasPrevious: boolean;
}

export interface IPaginationOutput {
	cursor: PaginationCursor;
	next?: string;
	previous?: string;
}

export enum PagerAction {
	Next = 'Next',
	Previous = 'Previous',
	First = 'First',
}

export interface IPagerFirst {
	action: PagerAction.First;
	limit: number;
}

export interface IPagerNext {
	action: PagerAction.Next;
	after: string;
	limit: number;
}

export interface IPagerPrevious {
	action: PagerAction.Previous;
	before: string;
	limit: number;
}
