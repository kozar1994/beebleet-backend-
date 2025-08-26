import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanResponseDto } from './dto/plan-response.dto';

@ApiTags('Plans')
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new plan' })
  @ApiCreatedResponse({ type: PlanResponseDto })
  async create(@Body() createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    return this.planService.create(createPlanDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a plan by ID' })
  @ApiOkResponse({ type: PlanResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<PlanResponseDto> {
    return this.planService.update(id, updatePlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a plan by ID' })
  @ApiOkResponse({ type: PlanResponseDto })
  async remove(
    @Param('id', ParseIntPipe) id: string,
  ): Promise<PlanResponseDto> {
    return this.planService.remove(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all plans' })
  @ApiOkResponse({ type: [PlanResponseDto] })
  async findAll(): Promise<PlanResponseDto[]> {
    return this.planService.findAll();
  }
}
