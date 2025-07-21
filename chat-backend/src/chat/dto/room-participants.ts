/* eslint-disable prettier/prettier */
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Group')
export class CreateGroupDto {
  @ApiProperty({ example: 'Study Group', description: 'Name of the group' })
  name: string;

  @ApiProperty({ example: 1, description: 'ID of the group creator' })
  creatorId: number;

  @ApiProperty({ example: [2, 3], description: 'IDs of participants', isArray: true, type: Number })
  participantIds: number[];
}
