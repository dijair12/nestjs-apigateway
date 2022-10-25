import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ChallengeStatus } from '../challenge-status.enum'

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly statusAccepted = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELLED
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.validateStatus(status)) {
      throw new BadRequestException(`${status} is a invalid status`);
    }

    return value;
  }

  private validateStatus(status: any) {
    const findIndexOfStatus = this.statusAccepted.indexOf(status);
    return findIndexOfStatus !== -1;
  }
}
