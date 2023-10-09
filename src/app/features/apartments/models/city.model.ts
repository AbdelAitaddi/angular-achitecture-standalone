export const Cities = {
  berlin: 'berlin',
  hamburg: 'hamburg',
  munich: 'munich',
} as const;

export type CityTypes = (typeof Cities)[keyof typeof Cities];

export const All_Cities = 'all';

export type CityTypesFilter = CityTypes | typeof All_Cities;
