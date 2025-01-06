import { CreateProceedingInputDTO } from '@backend/dtos/CreateProceedingInputDTO';
import { CriteriaInputDTO } from '@backend/dtos/CriteriaInputDTO';
import { NotaryCriteriaDTO } from '@backend/dtos/NotaryCriteriaDTO';
import { UpdateProceedingInputDTO } from '@backend/dtos/UpdateProceedingInputDTO';
import { CourtRepository } from '@backend/repositories/CourtRepository';
import { CriteriaRepository } from '@backend/repositories/CriteriaRepository';
import { UserService } from '@backend/services/UserService/UserService';

export class NotaryCriteriaService {
  private readonly userService: UserService;
  private readonly criteriaRepository: CriteriaRepository;
  private readonly courtRepository: CourtRepository;

  constructor(
    userService: UserService,
    criteriaRepository: CriteriaRepository,
    courtRepository: CourtRepository,
  ) {
    this.userService = userService;
    this.criteriaRepository = criteriaRepository;
    this.courtRepository = courtRepository;
  }

  async getNotaryCriteria(userId: number): Promise<NotaryCriteriaDTO | null> {
    const user = await this.userService.getUserById(userId);

    if (!user.criteriaId) {
      return null; // no defined criteria
    }

    const criteriaRecord =
      await this.criteriaRepository.getNotaryCriteriaRulesById(user.criteriaId);

    const court = await this.courtRepository.getCourtById(
      criteriaRecord.courtId,
    );

    const lastnameLettersCriteria =
      await this.criteriaRepository.getLastnameLettersCriteria(
        criteriaRecord.id,
      );
    const lastnameLetters = lastnameLettersCriteria.map(
      (entry) => entry.letter,
    );

    const dayMonthCriteria = await this.criteriaRepository.getDayMonthCriteria(
      criteriaRecord.id,
    );
    const daysMonths = dayMonthCriteria
      //.filter((dm) => dm.type === 'birth')
      .reduce(
        (acc, row) => {
          const targetArray =
            row.type === 'birth' ? acc.birthDaysMonths : acc.deathDaysMonths;

          // Find if a matching group exists
          let group = targetArray.find(
            (item) =>
              (row.day !== null && item.days.includes(row.day)) ||
              (row.month !== null && item.months.includes(row.month)) ||
              (row.month === null && item.months.length === 0) ||
              (row.day === null && item.days.length === 0),
          );

          // If no matching group, create a new one
          if (!group) {
            group = { days: [], months: [] };
            targetArray.push(group);
          }

          // Add the day or month if not null
          if (row.day !== null && !group.days.includes(row.day)) {
            group.days.push(row.day);
          }
          if (row.month !== null && !group.months.includes(row.month)) {
            group.months.push(row.month);
          }

          return acc;
        },
        {
          birthDaysMonths: [] as { days: number[]; months: number[] }[],
          deathDaysMonths: [] as { days: number[]; months: number[] }[],
        },
      );

    return {
      court: { id: criteriaRecord.courtId, name: court.name },
      lastnameLetters: lastnameLetters,
      birthDaysMonths: daysMonths.birthDaysMonths,
      deathDaysMonths: daysMonths.deathDaysMonths,
      rules: {
        lastnameLetters: criteriaRecord.lastnameLettersActive,
        birthDaysMonths: criteriaRecord.birthDaysMonthsActive,
        deathDaysMonths: criteriaRecord.deathDaysMonthsActive,
      },
    };
  }

  async saveCriteria(criteria: CriteriaInputDTO): Promise<number> {
    const criteriaId =
      await this.criteriaRepository.insertNotaryCriteria(criteria);

    await this.criteriaRepository.insertLastnameLettersCriteria(
      criteriaId,
      criteria.lastnameLetters,
    );

    await this.criteriaRepository.insertDaysMonthsCriteria(
      criteriaId,
      criteria,
    );

    return criteriaId;
  }

  async doesProceedingInputPassNotaryCriteria(
    notaryId: number,
    proceedingInput: CreateProceedingInputDTO | UpdateProceedingInputDTO,
  ): Promise<boolean> {
    let checks = [];

    const criteria = await this.getNotaryCriteria(notaryId);
    if (!criteria) return true; // notary has no defined criteria, so he can create any proceeding
    const passCourtResult = await this.doesDistrictPassCourtCriteria(
      criteria.court.id,
      proceedingInput.deceasedPersonInfo.district,
    );
    checks.push(passCourtResult);

    if (criteria.rules.lastnameLetters) {
      const passLastnameResult = this.doesLastnameLettersPassCriteria(
        criteria,
        proceedingInput.deceasedPersonInfo.lastname,
      );
      checks.push(passLastnameResult);
    }

    if (criteria.rules.birthDaysMonths) {
      const passBirthDayMonthResult = this.doesDatePassCriteria(
        criteria,
        proceedingInput.deceasedPersonInfo.birthdate,
        'birth',
      );
      checks.push(passBirthDayMonthResult);
    }

    if (criteria.rules.deathDaysMonths) {
      const passDeathDayMonthResult = this.doesDatePassCriteria(
        criteria,
        proceedingInput.deceasedPersonInfo.deathdate,
        'death',
      );
      checks.push(passDeathDayMonthResult);
    }

    return checks.every((result) => result); // return true only if all active criteria are passed
  }

  private async doesDistrictPassCourtCriteria(
    courtIdFromCriteria: number,
    districtInput: string,
  ): Promise<boolean> {
    const courtByInputDistrict =
      await this.courtRepository.getCourtByDistrictName(districtInput);
    return courtByInputDistrict.id === courtIdFromCriteria;
  }

  private doesLastnameLettersPassCriteria(
    criteria: NotaryCriteriaDTO,
    lastname: string,
  ): boolean {
    return criteria.lastnameLetters.includes(lastname.charAt(0));
  }

  private doesDatePassCriteria(
    criteria: NotaryCriteriaDTO,
    dateStr: string,
    type: string,
  ): boolean {
    const date = new Date(dateStr);
    const day = date.getDate(); // Extract the day
    const month = date.getMonth() + 1; // Extract the month (0-based, so +1)

    // Select the appropriate criteria group
    const criteriaGroups =
      type === 'birth' ? criteria.birthDaysMonths : criteria.deathDaysMonths;

    // Check if the date matches any group
    return criteriaGroups.some((group) => {
      const allowedDays = group.days;
      const allowedMonths = group.months;

      const daysAllowed = allowedDays.length === 0 || allowedDays.includes(day);
      const monthsAllowed =
        allowedMonths.length === 0 || allowedMonths.includes(month);

      return daysAllowed && monthsAllowed;
    });
  }
}
