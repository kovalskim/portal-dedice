import { CreateProceedingInputDTO } from '@backend/dtos/CreateProceedingInputDTO';
import { FindAllProceedingArgsDTO } from '@backend/dtos/FindAllProceedingArgsDTO';
import { UpdateProceedingInputDTO } from '@backend/dtos/UpdateProceedingInputDTO';
import { AppError } from '@backend/errors/AppError';
import { createToken } from '@backend/libs/jwt';
import { ParticipantInvitationRepository } from '@backend/repositories/ParticipantInvitationRepository';
import { ProceedingRepository } from '@backend/repositories/ProceedingRepository';
import { EmailService } from '@backend/services/EmailService/EmailService';
import { NotaryCriteriaService } from '@backend/services/NotaryCriteriaService';
import { ParticipantValidationService } from '@backend/services/ParticipantValidationService/ParticipantValidationService';
import { UserService } from '@backend/services/UserService/UserService';
import { JWTPayload } from '@backend/types/types';
import { deceasedInfoSchema } from '@shared/schemas/deceasedInfoSchema';
import { newProceedingInputSchema } from '@shared/schemas/newProceedingInputSchema';

export class ProceedingService {
  private readonly authUser: JWTPayload | null;
  private readonly proceedingRepository: ProceedingRepository;
  private readonly participantInvitationRepository: ParticipantInvitationRepository;
  private readonly emailService: EmailService;
  private readonly participantValidationService: ParticipantValidationService;
  private readonly userService: UserService;
  private readonly notaryCriteriaService: NotaryCriteriaService;

  constructor(
    authUser: JWTPayload | null,
    proceedingRepository: ProceedingRepository,
    participantInvitationRepository: ParticipantInvitationRepository,
    emailService: EmailService,
    participantValidationService: ParticipantValidationService,
    userService: UserService,
    notaryCriteriaService: NotaryCriteriaService,
  ) {
    this.authUser = authUser;
    this.proceedingRepository = proceedingRepository;
    this.participantInvitationRepository = participantInvitationRepository;
    this.emailService = emailService;
    this.participantValidationService = participantValidationService;
    this.userService = userService;
    this.notaryCriteriaService = notaryCriteriaService;
  }

  async findAllProceedings(userId: number, args: FindAllProceedingArgsDTO) {
    const isUserNotary = await this.userService.hasUserNotaryRole(userId);
    const allProceedings = isUserNotary
      ? await this.proceedingRepository.getAllProceedingsByNotaryId(
          userId,
          args.currentPage,
          args.pageSize,
          args.sortOrder,
          args.filterProceedingNumber,
          args.filterDeceasedName,
          args.filterStartDate,
          args.filterPhaseId,
          args.filterStatus,
        )
      : await this.proceedingRepository.getAllProceedingsByParticipantId(
          userId,
          args.currentPage,
          args.pageSize,
          args.sortOrder,
          args.filterProceedingNumber,
          args.filterDeceasedName,
          args.filterStartDate,
          args.filterPhaseId,
          args.filterStatus,
        );

    return {
      data: allProceedings.data.map((proceeding) => ({
        ...proceeding,
        deceasedDateOfDeath: proceeding.deceasedDateOfDeath,
        deceasedDateOfBirth: proceeding.deceasedDateOfBirth,
        startDate: proceeding.startDate,
      })),
      total: allProceedings.total,
    };
  }

  async getProceeding(userId: number, proceedingId: number) {
    if (
      !(await this.participantValidationService.isUserParticipantOrNotaryOfProceeding(
        userId,
        proceedingId,
      ))
    ) {
      throw new AppError(
        'UNAUTHORIZED',
        'Unauthorized to fetch participants of the proceeding',
      );
    }

    const proceeding =
      await this.proceedingRepository.getProceedingById(proceedingId);

    if (!proceeding) {
      throw new AppError('NOT_FOUND', 'Proceedings not found');
    }

    return proceeding;
  }

  async createNewProceeding(userId: number, input: CreateProceedingInputDTO) {
    try {
      newProceedingInputSchema.parse(input);
    } catch (error) {
      throw new AppError('VALIDATION_ERROR', 'Not valid input');
    }

    if (
      !(await this.notaryCriteriaService.doesProceedingInputPassNotaryCriteria(
        userId,
        input,
      ))
    ) {
      throw new AppError('CRITERIA_ERROR');
    }

    const proceedingNumber = `${new Date().getFullYear()}_${new Date().getMonth()}_${new Date().getDate()}_${input.deceasedPersonInfo.firstname[0]}${input.deceasedPersonInfo.lastname.slice(0, 2)}`;
    // Create the proceedings in the database
    const newProceedingId = await this.proceedingRepository.createProceeding({
      proceedingNumber: proceedingNumber,
      notaryId: userId,
      startDate: new Date(), //TODO: taky jako input
      deceasedFirstName: input.deceasedPersonInfo.firstname,
      deceasedLastName: input.deceasedPersonInfo.lastname,
      deceasedDateOfDeath: new Date(input.deceasedPersonInfo.deathdate),
      deceasedDateOfBirth: new Date(input.deceasedPersonInfo.birthdate),
      deceasedStreetWithNumber: input.deceasedPersonInfo.streetWithNumber,
      deceasedCity: input.deceasedPersonInfo.city,
      deceasedDistrict: input.deceasedPersonInfo.district,
      deceasedPostalCode: input.deceasedPersonInfo.postalCode,
      deceasedSex: input.deceasedPersonInfo.sex,
    });

    const token = createToken({ email: input.narratorContactInfo.email });

    await this.participantInvitationRepository.createParticipantInvitation({
      proceedingId: newProceedingId,
      participantEmail: input.narratorContactInfo.email!,
      participantFirstname: input.narratorContactInfo.firstname!,
      participantLastname: input.narratorContactInfo.lastname!,
      token: token,
      expiresAt: new Date(),
    });

    await this.emailService.sendParticipantInvitationEmail(
      input.narratorContactInfo.email!,
      input.narratorContactInfo.firstname!,
      input.narratorContactInfo.lastname!,
      token,
    );

    // Return the created proceedings
    return await this.proceedingRepository.getProceedingById(newProceedingId);
  }

  async deleteProceeding(userId: number, proceedingId: number) {
    if (
      !(await this.participantValidationService.isUserNotaryInProceeding(
        userId,
        proceedingId,
      ))
    ) {
      throw new AppError(
        'UNAUTHORIZED',
        'Unauthorized to delete the proceeding',
      );
    }

    const existingProceeding =
      await this.proceedingRepository.getProceedingById(proceedingId);
    if (!existingProceeding) {
      throw new AppError('NOT_FOUND', 'Proceeding to delete not found');
    }

    await this.proceedingRepository.deleteProceeding(proceedingId);

    const deletedProceeding =
      await this.proceedingRepository.getProceedingById(proceedingId);
    if (deletedProceeding) {
      throw new AppError(
        'DELETE_ERROR',
        'Delete failed: proceeding still exists',
      );
    }
    return true;
  }

  async updateProceeding(
    userId: number,
    proceedingId: number,
    updateProceedingInput: UpdateProceedingInputDTO,
  ) {
    try {
      deceasedInfoSchema.parse(updateProceedingInput.deceasedPersonInfo);
    } catch (error) {
      throw new AppError('VALIDATION_ERROR', 'Not valid input.');
    }

    if (
      !(await this.participantValidationService.isUserNotaryInProceeding(
        userId,
        proceedingId,
      ))
    ) {
      throw new AppError(
        'UNAUTHORIZED',
        'Unauthorized to delete the proceeding',
      );
    }

    const existingProceeding =
      await this.proceedingRepository.getProceedingById(proceedingId);
    if (!existingProceeding) {
      throw new AppError('NOT_FOUND', 'Proceeding not found.');
    }

    if (
      !(await this.notaryCriteriaService.doesProceedingInputPassNotaryCriteria(
        userId,
        updateProceedingInput,
      ))
    ) {
      throw new AppError('CRITERIA_ERROR');
    }

    await this.proceedingRepository.updateProceeding(proceedingId, {
      deceasedFirstName: updateProceedingInput.deceasedPersonInfo.firstname,
      deceasedLastName: updateProceedingInput.deceasedPersonInfo.lastname,
      deceasedDateOfDeath: new Date(
        updateProceedingInput.deceasedPersonInfo.deathdate,
      ),
      deceasedDateOfBirth: new Date(
        updateProceedingInput.deceasedPersonInfo.birthdate,
      ),
      deceasedStreetWithNumber:
        updateProceedingInput.deceasedPersonInfo.streetWithNumber,
      deceasedCity: updateProceedingInput.deceasedPersonInfo.city,
      deceasedDistrict: updateProceedingInput.deceasedPersonInfo.district,
      deceasedPostalCode: updateProceedingInput.deceasedPersonInfo.postalCode,
      deceasedSex: updateProceedingInput.deceasedPersonInfo.sex,
    });

    return await this.proceedingRepository.getProceedingById(proceedingId);
  }

  async updateProceedingPhase(
    userId: number,
    proceedingId: number,
    phaseId: number,
  ) {
    if (
      !(await this.participantValidationService.isUserNotaryInProceeding(
        userId,
        proceedingId,
      ))
    ) {
      throw new AppError(
        'UNAUTHORIZED',
        'Unauthorized to delete the proceeding',
      );
    }

    const updatedProceeding = await this.proceedingRepository.updateProceeding(
      proceedingId,
      {
        phaseId: phaseId,
      },
    );

    return updatedProceeding?.phaseId === phaseId;
  }
}
