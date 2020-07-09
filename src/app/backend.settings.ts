import { environment as env } from '../environments/environment';

export class BackendAppSettings {

    baseUrl:string = '';

    static endpoint = {
        getAllStates: {
            getUrl(pageSize = 100, pageNo = 0, sortBy = 'id'): string {
                const url = `states?pageSize=${pageSize}&pageNo=${pageNo}&sortBy=${sortBy}`;
                return `${env.backend.baseUrl}/${url}`;
            }
        },
        authenticate: {
            getUrl(): string {
                const url = `authenticate`;
                return `${env.backend.baseUrl}/${url}`;
            }
        }
    };
}