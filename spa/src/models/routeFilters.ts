export interface RouteFilters {
gradeWeights?: Record<number, [number, number]>;
gradeTypes?: Array<number>;
length?: [number, number];
orientation?: Array<number>;
path?: string;
offset?: number;
query?: string;
}
