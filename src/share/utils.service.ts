import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  public titleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  public async cleanTheFileName(fileName) {
    return fileName
      .replace(/ /g, '_')
      .replace(/[^a-zA-Z0-9 _.-]/g, '')
      .toLowerCase();
  }

  public condenseWhitespace(str: string): string {
    return str.replace(/\s+/g, ' ').trim();
  }

  public async currentDateShort() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const monthString = month < 10 ? `0${month}` : `${month}`;
    const day = currentDate.getDate();
    return `${year}_${monthString}_${day}`;
  }
  public async currentDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const monthString = month < 10 ? `0${month}` : `${month}`;
    const day = currentDate.getDate();
    return `${year}_${monthString}_${day}_
      ${currentDate.getHours()}_
      ${currentDate.getMinutes()}_
      ${currentDate.getSeconds()}`;
  }
}
