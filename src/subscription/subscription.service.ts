import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}
  findAll(): Promise<Subscription[]> {
    return this.subscriptionRepository.find();
  }

  findOne(subscriptionId: string): Promise<Subscription> {
    return this.subscriptionRepository.findOne({
      where: { SubscriptionID: subscriptionId },
    });
  }

  create(subscription: Subscription): Promise<Subscription> {
    return this.subscriptionRepository.save(subscription);
  }

  async update(
    subscriptionId: string,
    subscription: Subscription,
  ): Promise<Subscription> {
    await this.subscriptionRepository.update(subscriptionId, subscription);
    return this.subscriptionRepository.findOne({
      where: { SubscriptionID: subscriptionId },
    });
  }

  async delete(subscriptionId: string, user: string): Promise<void> {
    const subscription: Subscription =
      await this.subscriptionRepository.findOne({
        where: { SubscriptionID: subscriptionId },
      });
    subscription.DeletedBy = user;
    subscription.DeletedAt = new Date();
    await this.subscriptionRepository.save(subscription);
  }
}
