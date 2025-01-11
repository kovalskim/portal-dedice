import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import {
  assets,
  businessParticipation,
  car,
  financialInstrument,
  other,
  valuable,
} from '@backend/db/schema';
import { AssetsAllDTO, CreateAssetsAllDTO } from '@backend/dtos/AssetsDTO';

export class AssetRepository {
  db: MySql2Database<Record<string, unknown>>;

  constructor(db: MySql2Database<Record<string, unknown>>) {
    this.db = db;
  }

  async create(relatedData: CreateAssetsAllDTO): Promise<void> {
    const {
      financialInstruments,
      businessParticipations,
      cars,
      valuables,
      others,
      generalInfo,
    } = relatedData;

    const asset = await this.db
      .insert(assets)
      .values({
        ...generalInfo,
      })
      .$returningId();

    const assetId = asset[0].id;

    for (const fi of financialInstruments) {
      await this.db.insert(financialInstrument).values({ ...fi, assetId });
    }

    for (const bp of businessParticipations) {
      await this.db.insert(businessParticipation).values({ ...bp, assetId });
    }

    for (const auto of cars) {
      await this.db.insert(car).values({ ...auto, assetId });
    }

    for (const val of valuables) {
      await this.db.insert(valuable).values({ ...val, assetId });
    }

    for (const ot of others) {
      await this.db.insert(other).values({ ...ot, assetId });
    }
  }

  async getAssetByProceedingId(
    proceedingId: number,
  ): Promise<AssetsAllDTO | null> {
    const generalInfo = await this.db
      .select()
      .from(assets)
      .where(eq(assets.proceedingsId, proceedingId));

    if (generalInfo.length === 0) return null;

    const assetId = generalInfo[0].id;

    const financialInstrumentsData = await this.db
      .select()
      .from(financialInstrument)
      .where(eq(financialInstrument.assetId, assetId));

    const businessParticipationData = await this.db
      .select()
      .from(businessParticipation)
      .where(eq(businessParticipation.assetId, assetId));

    const carData = await this.db
      .select()
      .from(car)
      .where(eq(car.assetId, assetId));

    const valuablesData = await this.db
      .select()
      .from(valuable)
      .where(eq(valuable.assetId, assetId));

    const othersData = await this.db
      .select()
      .from(other)
      .where(eq(other.assetId, assetId));

    return {
      generalInfo: generalInfo[0],
      financialInstruments: financialInstrumentsData,
      businessParticipations: businessParticipationData,
      cars: carData,
      valuables: valuablesData,
      others: othersData,
    };
  }

  async update(assetId: number, updates: CreateAssetsAllDTO): Promise<void> {
    const { generalInfo } = updates;

    await this.db.update(assets).set(generalInfo).where(eq(assets.id, assetId));

    await this.db.transaction(async (trx) => {
      const {
        financialInstruments,
        businessParticipations,
        cars,
        valuables,
        others,
      } = updates;

      if (financialInstruments) {
        await trx
          .delete(financialInstrument)
          .where(eq(financialInstrument.assetId, assetId));
        for (const fi of financialInstruments) {
          await trx
            .insert(financialInstrument)
            .values({ ...fi, assetId: assetId });
        }
      }

      if (businessParticipation) {
        await trx
          .delete(businessParticipation)
          .where(eq(businessParticipation.assetId, assetId));
        for (const bp of businessParticipations) {
          await trx
            .insert(businessParticipation)
            .values({ ...bp, assetId: assetId });
        }
      }

      if (car) {
        await trx.delete(car).where(eq(car.assetId, assetId));
        for (const auto of cars) {
          await trx.insert(car).values({ ...auto, assetId: assetId });
        }
      }

      if (valuables) {
        await trx.delete(valuable).where(eq(valuable.assetId, assetId));
        for (const val of valuables) {
          await trx.insert(valuable).values({ ...val, assetId: assetId });
        }
      }

      if (others) {
        await trx.delete(other).where(eq(other.assetId, assetId));
        for (const ot of others) {
          await trx.insert(other).values({ ...ot, assetId: assetId });
        }
      }
    });
  }

  async delete(assetId: number): Promise<void> {
    await this.db.delete(assets).where(eq(assets.id, assetId));
  }
}
