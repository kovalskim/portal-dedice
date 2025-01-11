import { FileDTO } from '@backend/dtos/FileDTO';
import { AppError } from '@backend/errors/AppError';
import { FileRepository } from '@backend/repositories/FileRepository';
import { AwsService } from '@backend/services/AwsService/AwsService';
import { ParticipantValidationService } from '@backend/services/ParticipantValidationService/ParticipantValidationService';
import { ProceedingService } from '@backend/services/ProceedingService/ProceedingService';
import { UserService } from '@backend/services/UserService/UserService';
import { JWTPayload } from '@backend/types/types';

export class FileService {
  private readonly authUser: JWTPayload | null;
  private participantValidationService: ParticipantValidationService;
  private fileRepository: FileRepository;
  private awsService: AwsService;
  private userService: UserService;
  private proceedingService: ProceedingService;

  constructor(
    authUser: JWTPayload | null,
    participantValidationService: ParticipantValidationService,
    fileRepository: FileRepository,
    awsService: AwsService,
    userService: UserService,
    proceedingService: ProceedingService,
  ) {
    this.authUser = authUser;
    this.participantValidationService = participantValidationService;
    this.fileRepository = fileRepository;
    this.awsService = awsService;
    this.userService = userService;
    this.proceedingService = proceedingService;
  }

  async findFilesByProceeding(proceedingId: number): Promise<FileDTO[]> {
    if (
      !(await this.participantValidationService.isUserParticipantOrNotaryOfProceeding(
        this.authUser!.id,
        proceedingId,
      )) &&
      !(await this.userService.hasUserAdminRole(this.authUser!.id))
    ) {
      throw new AppError('NOT_PROCEEDING_PARTICIPANT');
    }

    const files =
      await this.fileRepository.findFilesByProceedingId(proceedingId);

    return Promise.all(
      files.map((f) =>
        this.awsService
          .getFilePath(`${f.proceedingId}/${f.path}`)
          .then((path) => ({
            ...f,
            path,
          })),
      ),
    );
  }

  async deleteFile(fileId: string): Promise<void> {
    const id = parseInt(fileId, 10);

    const file = await this.fileRepository.getFileById(id);

    if (!file) {
      throw new AppError('FILE_NOT_FOUND');
    }

    if (
      !(await this.participantValidationService.isUserParticipantOrNotaryOfProceeding(
        this.authUser!.id,
        file.proceedingId,
      ))
    ) {
      throw new AppError('NOT_PROCEEDING_PARTICIPANT');
    }

    if (await this.proceedingService.isProceedingFinished(file.proceedingId)) {
      throw new AppError('PROCEEDING_FINISHED');
    }

    try {
      await this.fileRepository.deleteFile(id);
    } catch (error) {
      throw new AppError('SERVER_ERROR', 'Failed to delete file');
    }

    try {
      await this.awsService.deleteFile(`${file.proceedingId}/${file.path}`);
    } catch (error) {
      throw new AppError('SERVER_ERROR', 'Failed to delete file from storage');
    }
  }

  async getSignedUrl(
    proceedingStringId: string,
    filename: string,
    filetype: string,
  ): Promise<string> {
    const proceedingId = parseInt(proceedingStringId, 10);

    if (
      !(await this.participantValidationService.isUserParticipantOrNotaryOfProceeding(
        this.authUser!.id,
        proceedingId,
      ))
    ) {
      throw new AppError('NOT_PROCEEDING_PARTICIPANT');
    }

    if (await this.proceedingService.isProceedingFinished(proceedingId)) {
      throw new AppError('PROCEEDING_FINISHED');
    }

    const key = `${proceedingId}/${filename}`;

    return await this.awsService.getUploadUrl(key, filetype);
  }

  async saveFile(
    proceedingStringId: string,
    alias: string,
    type: string,
    key: string,
  ): Promise<void> {
    const proceedingId = parseInt(proceedingStringId, 10);

    if (
      !(await this.participantValidationService.isUserParticipantOrNotaryOfProceeding(
        this.authUser!.id,
        proceedingId,
      ))
    ) {
      throw new AppError('NOT_PROCEEDING_PARTICIPANT');
    }

    if (await this.proceedingService.isProceedingFinished(proceedingId)) {
      throw new AppError('PROCEEDING_FINISHED');
    }

    await this.fileRepository.saveFile(
      proceedingId,
      alias,
      type,
      this.authUser!.id,
      key,
    );
  }
}
