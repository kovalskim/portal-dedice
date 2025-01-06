import { DeceasedPersonInputDTO } from '@backend/dtos/DeceasedPersonInputDTO';
import { ScheduleDTO } from '@backend/dtos/ScheduleDTO';
import { AppError } from '@backend/errors/AppError';
import { CourtRepository } from '@backend/repositories/CourtRepository';
import { ScheduleRepository } from '@backend/repositories/ScheduleRepository';
import { deceasedInfoSchema } from '@shared/schemas/deceasedInfoSchema';

export class ScheduleService {
  private readonly courtRepository: CourtRepository;
  private readonly scheduleRepository: ScheduleRepository;

  constructor(
    courtRepository: CourtRepository,
    scheduleRepository: ScheduleRepository,
  ) {
    this.courtRepository = courtRepository;
    this.scheduleRepository = scheduleRepository;
  }

  async getScheduleByNotaryNameAndCourtId(name: string, courtId: number) {
    return await this.scheduleRepository.getScheduleByNotaryNameAndCourtId(
      name,
      courtId,
    );
  }

  async getCourtById(id: number) {
    return await this.courtRepository.getCourtById(id);
  }

  async findAllCourts() {
    return await this.courtRepository.findCourts();
  }

  async identifyNotary(deceasedPersonInput: DeceasedPersonInputDTO) {
    try {
      deceasedInfoSchema.parse(deceasedPersonInput);
    } catch (error) {
      throw new AppError(
        'VALIDATION_ERROR',
        'Not valid deceased person info input.',
      );
    }

    const competentCourt = await this.courtRepository.getCourtByDistrictName(
      deceasedPersonInput.district,
    );

    if (!competentCourt) {
      throw new AppError('NOT_SUPPORTED', 'Court not found.');
    }

    let attribute;
    switch (competentCourt.attribute) {
      case 'birthdate':
        attribute = deceasedPersonInput.birthdate;
    }

    const schedule =
      await this.scheduleRepository.getScheduleByCourtAndAttribute(
        competentCourt.id,
        attribute,
      );

    if (!schedule) {
      throw new AppError('NOT_FOUND', 'Notary schedule not found error');
    }
    return schedule;
  }

  async updateSchedule(schedule: ScheduleDTO) {
    await this.scheduleRepository.updateSchedule(schedule);
  }
}
