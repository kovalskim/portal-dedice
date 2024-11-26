import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { NotaryPaymentCalculation } from '@backend/graphql/modules/notaryPaymentCalculation/NotaryPaymentCalculationType';
import type { CustomContext } from '@backend/types/types';

@Resolver(() => NotaryPaymentCalculation)
export class NotaryPaymentCalculationResolver {
  @Mutation(() => NotaryPaymentCalculation)
  async notaryPaymentCalculation(
    @Arg('estateTotalValue') estateTotalValue: number,
    @Ctx() { notaryPaymentCalculationService }: CustomContext,
  ): Promise<NotaryPaymentCalculation> {
    return notaryPaymentCalculationService.getNotaryPaymentCalculation(
      estateTotalValue,
    );
  }
}
