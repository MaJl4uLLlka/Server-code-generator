export class RepositoryServerData {
    id: string;
    name: string;
    type: 'PUBLIC' | 'PRIVATE';
    userId: string;
    templateId: string;
    user: {
        nick: string;
    }
}

export class Repository {
    id: string;
    name: string;
    type: 'PUBLIC' | 'PRIVATE';
}