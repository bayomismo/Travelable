import { destinations, type Destination } from './travel-data';

export const popularDestinations: Destination[] = destinations.filter((d) => d.trending).slice(0, 8);