import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { Subscription } from './subscription.entity';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  async findAll(): Promise<Subscription[]> {
    return this.subscriptionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Subscription> {
    return this.subscriptionService.findOne(id);
  }

  @Post()
  async create(@Body() subscription: Subscription): Promise<Subscription> {
    return this.subscriptionService.create(subscription);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() subscription: Subscription,
  ): Promise<Subscription> {
    return this.subscriptionService.update(id, subscription);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.subscriptionService.delete(id, 'user');
  }
}
