import { AppError } from '@backend/errors/AppError';
import { File } from '@backend/graphql/modules/file/fileType';
import { FilesRepository } from '@backend/repository/FilesRepository';
import { AwsService } from '@backend/services/AwsService/AwsService';
import { ParticipantValidationService } from '@backend/services/ParticipantValidationService/ParticipantValidationService';
import { JWTPayload } from '@backend/types/types';

export class FileService {
  private readonly authUser: JWTPayload | null;
  private participantValidationService: ParticipantValidationService;
  private filesRepository: FilesRepository;
  private awsService: AwsService;

  constructor(
    authUser: JWTPayload | null,
    participantValidationService: ParticipantValidationService,
    filesRepository: FilesRepository,
    awsService: AwsService,
  ) {
    this.authUser = authUser;
    this.participantValidationService = participantValidationService;
    this.filesRepository = filesRepository;
    this.awsService = awsService;
  }

  async findFilesByProceeding(proceedingId: number): Promise<File[]> {
    if (
      !(await this.participantValidationService.isUserParticipantOrNotaryOfProceeding(
        this.authUser!.id,
        proceedingId,
      ))
    ) {
      throw new AppError('NOT_PROCEEDING_PARTICIPANT');
    }

    const files =
      await this.filesRepository.findFilesByProceedingId(proceedingId);

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

    const file = await this.filesRepository.getFileById(id);

    if (
      !(await this.participantValidationService.isUserParticipantOrNotaryOfProceeding(
        this.authUser!.id,
        file.proceedingId,
      ))
    ) {
      throw new AppError('NOT_PROCEEDING_PARTICIPANT');
    }

    if (!file) {
      throw new AppError('FILE_NOT_FOUND');
    }

    try {
      await this.filesRepository.deleteFile(id);
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

    await this.filesRepository.saveFile(
      proceedingId,
      alias,
      type,
      this.authUser!.id,
      key,
    );
  }
}
