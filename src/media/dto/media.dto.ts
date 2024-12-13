import { Expose } from "class-transformer";

export class MediaDto{

    @Expose()
    id: number

    @Expose()
    path: string;

    @Expose()
    type: string;

    @Expose()
    title: string;

    @Expose()
    description: string;
}