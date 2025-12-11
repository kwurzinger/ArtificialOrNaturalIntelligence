import { ApiProperty } from '@nestjs/swagger';

export class ContentIdsResponse {
  @ApiProperty({
    example: 1,
    description: 'Eindeutige ID eines Contents',
  })
  content_id: number;
}

export class ContentLinkResponse {
  @ApiProperty({
    example: 'http://localhost:3000/static/sampleText.txt',
    description: 'Direkter Link zum Content',
  })
  content_link: string;

  @ApiProperty({
    example: 'AI',
    description: 'Ersteller des Contents',
  })
  content_creator: string;
}