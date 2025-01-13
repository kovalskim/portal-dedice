import { AppError } from '@backend/errors/AppError';
import { createToken } from '@backend/libs/jwt';
import { EmailService } from '@backend/modules/emails/EmailService';
import { CourtRepository } from '@backend/modules/schedules/repositories/CourtRepository';
import { ScheduleService } from '@backend/modules/schedules/services/ScheduleService';
import { UserRole } from '@backend/modules/users/dtos/RoleDTO';
import { UserInvitationInput } from '@backend/modules/users/graphql/types/UserInvitationInput';
import { UserInvitationRepository } from '@backend/modules/users/repositories/UserInvitationRepository';
import { NotaryCriteriaService } from '@backend/modules/users/services/NotaryCriteriaService';
import { UserService } from '@backend/modules/users/services/UserService';
import { JWTPayload } from '@backend/types/types';

export class UserInvitationService {
  private readonly authUser: JWTPayload | null;
  private readonly emailService: EmailService;
  private readonly userService: UserService;
  private readonly scheduleService: ScheduleService;
  private readonly userInvitationRepository: UserInvitationRepository;
  private readonly courtRepository: CourtRepository;
  private readonly notaryCriteriaService: NotaryCriteriaService;

  constructor(
    authUser: JWTPayload | null,
    emailService: EmailService,
    userService: UserService,
    scheduleService: ScheduleService,
    userInvitationRepository: UserInvitationRepository,
    courtRepository: CourtRepository,
    notaryCriteriaService: NotaryCriteriaService,
  ) {
    this.authUser = authUser;
    this.emailService = emailService;
    this.userService = userService;
    this.scheduleService = scheduleService;
    this.userInvitationRepository = userInvitationRepository;
    this.courtRepository = courtRepository;
    this.notaryCriteriaService = notaryCriteriaService;
  }

  async inviteUserToPortalApp(input: UserInvitationInput) {
    if (!(await this.userService.hasUserAdminRole(this.authUser!.id))) {
      throw new AppError(
        'UNAUTHORIZED',
        'Not authorized to send user invitation.',
      );
    }

    const user = await this.userService.getUserByEmail(input.email);
    if (user)
      throw new AppError(
        'ALREADY_EXISTING',
        'User with this email already exists.',
      );

    const role = await this.userService.getRoleByName(input.role);
    if (!role) {
      throw new AppError(
        'NOT_FOUND',
        'Role was not found. User with this role cannot be invited.',
      );
    }

    let notaryCriteriaId;
    if (input.role === UserRole.NOTARY) {
      // find court if exists
      const court = await this.courtRepository.getCourtById(
        Number(input.criteria?.court?.value),
      );
      if (!court) {
        throw new AppError(
          'NOT_FOUND',
          'Court was not found. Notary cannot be invited.',
        );
      }

      notaryCriteriaId = await this.notaryCriteriaService.saveCriteria(
        input.criteria,
      );
    }

    const token = createToken({
      firstname: input.firstname,
      lastname: input.lastname,
      email: input.email,
      role: input.role,
    });

    const tokenRecordId =
      await this.userInvitationRepository.createUserInvitation({
        email: input.email,
        firstname: input.firstname,
        lastname: input.lastname,
        role: input.role,
        criteriaId: notaryCriteriaId ?? null,
        token: token,
        expiresAt: null,
      });

    await this.emailService.sendUserInvitationEmail(
      input.email,
      input.firstname,
      input.lastname,
      role.description,
      token,
    );

    console.log(
      `UserInvitationToken created with id: ${tokenRecordId}, User with email: ${input.email} invited.`,
    );

    return true;
  }
}
