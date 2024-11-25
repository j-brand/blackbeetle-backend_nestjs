import { Expose, Type } from "class-transformer";
import { CommentDto } from "./comment.dto";
import { PageMetaDto } from "@shared/pagination/page-meta.dto";
import { IsArray } from "class-validator";

export class CommentPageDto {

    @Expose()
    @IsArray()
    @Type(() => CommentDto)
    comments: CommentDto[];

    @Expose()
    @Type(() => PageMetaDto)
    meta: PageMetaDto;

    constructor(comments: CommentDto[], meta: PageMetaDto) {
        this.comments = comments;
        this.meta = meta;
    }
}