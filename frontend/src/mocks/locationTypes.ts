export interface LocationTypeMock {
    id: number;
    name: string;
}

export enum LocationType {
    PRESTATAIRE_LOCATION_TYPE_ID = 1,
    STORY_LOCATION_TYPE_ID = 2,
    OTHER_LOCATION_TYPE_ID = 3,
}

export const LOCATION_TYPES: LocationTypeMock[] = [
    { id: LocationType.PRESTATAIRE_LOCATION_TYPE_ID, name: 'prestataire' },
    { id: LocationType.STORY_LOCATION_TYPE_ID, name: 'story' },
    { id: LocationType.OTHER_LOCATION_TYPE_ID, name: 'other' },
];