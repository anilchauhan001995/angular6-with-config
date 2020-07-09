export interface IState {
    id: number;
    stateName: string;
    modifiedBy: string;
    modifiedDate: string;
    createdBy: string;
    active: boolean;
}

export interface IPageable {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
} 

export interface IStateResponse {
    content: IState[];
    number: number
    numberOfElements: number;
    totalElements: number;
    totalPages: number;
    pageable: IPageable;
}