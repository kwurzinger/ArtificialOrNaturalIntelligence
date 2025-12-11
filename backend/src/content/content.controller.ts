import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ContentService } from './content.service';
import { Content } from './entities/content.entity';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContentIdsResponse, ContentLinkResponse } from './dto/content.dto';

@Controller('content')
@ApiTags('Content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get("/level/:level")
  @ApiOperation({ summary: 'Liefert eine Liste aller ContentIds für ein bestimmtes Level' })
  @ApiOkResponse({
    description: 'Erfolgreiche Antwort',
    type: ContentIdsResponse,
    isArray: true
  })
  async getContentIdsByLevel(@Param('level', ParseIntPipe) level: number): Promise<Content[]> {
    const contentIds = await this.contentService.getContentIdsByLevel(level);

    if (contentIds.length == 0){
      throw new NotFoundException("Für dieses Level gibt es keine Inhalte!");
    }

    return contentIds;
  }

  @Get(":id")
  @ApiOperation({ summary: 'Liefert den Link zum gewünschten Content anhand der ContentId' })
  @ApiOkResponse({
    description: 'Erfolgreiche Antwort',
    type: ContentLinkResponse
  })
  async getContentById(@Param('id', ParseIntPipe) id: number): Promise<Content> {
    const content = await this.contentService.getContentById(id);

    if (!content) {
      throw new NotFoundException("Ein Inhalt mit dieser ID existiert nicht!");
    }

    return content;
  }

  //TODO: implement POST AND DELETE Endpoints

  // @Post()
  // addContent(@Body() createContentDto: CreateContentDto): Promise<Response> {
  //   return this.contentService.addContent(createContentDto);
  // }

  // @Delete(":id")
  // removeContentById(@Param() param: any): Promise<Response> {
  //   return this.contentService.removeContentById(param.id);
  // }
}
