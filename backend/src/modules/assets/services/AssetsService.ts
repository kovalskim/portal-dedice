import { AppError } from '@backend/errors/AppError';
import { CreateAssetsAllInput } from '@backend/modules/assets/graphql/types/AssetsInput';
import { AssetsAll } from '@backend/modules/assets/graphql/types/AssetsType';
import { AssetRepository } from '@backend/modules/assets/repositories/AssetRepository';
import { ParticipantValidationService } from '@backend/modules/participants/services/ParticipantValidationService';
import { ProceedingService } from '@backend/modules/proceedings/services/ProceedingService';
import { UserService } from '@backend/modules/users/services/UserService';

export class AssetsService {
  private readonly assetRepository: AssetRepository;
  private readonly participantValidationService: ParticipantValidationService;
  private readonly userService: UserService;
  private readonly proceedingService: ProceedingService;

  constructor(
    participantValidationService: ParticipantValidationService,
    assetRepository: AssetRepository,
    userService: UserService,
    proceedingService: ProceedingService,
  ) {
    this.participantValidationService = participantValidationService;
    this.assetRepository = assetRepository;
    this.userService = userService;
    this.proceedingService = proceedingService;
  }

  async findAssets(
    userId: number,
    proceedingId: number,
  ): Promise<AssetsAll | null> {
    await this.validateUserBeforeAction(userId, proceedingId);

    const asset =
      await this.assetRepository.getAssetByProceedingId(proceedingId);

    if (!asset) {
      return null;
    }

    const lastEditor = await this.userService.getUserById(
      asset.generalInfo.modifiedBy,
    );

    return {
      ...asset,
      generalInfo: {
        ...asset.generalInfo,
        modifiedBy: `${lastEditor.firstname} ${lastEditor.lastname}`,
      },
    };
  }

  async createOrUpdateAssets(
    userId: number,
    proceedingId: number,
    assetInput: CreateAssetsAllInput,
  ) {
    await this.validateUserBeforeAction(userId, proceedingId);

    if (await this.proceedingService.isProceedingFinished(proceedingId)) {
      throw new AppError('PROCEEDING_FINISHED');
    }

    const asset =
      await this.assetRepository.getAssetByProceedingId(proceedingId);

    const assetWithInfo = {
      ...assetInput,
      generalInfo: {
        lastModified: new Date(),
        modifiedBy: userId,
        proceedingsId: proceedingId,
      },
    };

    if (!asset) {
      await this.assetRepository.create(assetWithInfo);
    } else {
      await this.assetRepository.update(asset.generalInfo.id, assetWithInfo);
    }

    return true;
  }

  async deleteAssets(userId: number, proceedingId: number) {
    await this.validateUserBeforeAction(userId, proceedingId);

    if (await this.proceedingService.isProceedingFinished(proceedingId)) {
      throw new AppError('PROCEEDING_FINISHED');
    }

    const asset =
      await this.assetRepository.getAssetByProceedingId(proceedingId);

    if (!asset) {
      return false;
    }

    await this.assetRepository.delete(asset.generalInfo.id);
    return true;
  }

  async validateUserBeforeAction(userId: number, proceedingId: number) {
    if (
      !(await this.participantValidationService.isUserParticipantOrNotaryOfProceeding(
        userId,
        proceedingId,
      ))
    ) {
      throw new AppError('NOT_PROCEEDING_PARTICIPANT');
    }
  }
}
