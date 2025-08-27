import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceResponseDto } from './dto/invoice-response.dto';

@ApiTags('Invoices')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiCreatedResponse({ type: InvoiceResponseDto })
  async create(
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an invoice by ID' })
  @ApiOkResponse({ type: InvoiceResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.update(id, updateInvoiceDto);
  }

  @Post('webhook/:sessionId')
  @ApiOperation({ summary: 'Handle Stripe payment webhook' })
  @ApiOkResponse({ type: InvoiceResponseDto })
  async handleWebhook(
    @Param('sessionId') sessionId: string,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.handleWebhook(sessionId);
  }
}
