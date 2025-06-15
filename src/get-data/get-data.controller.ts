import { Controller, Get, Query } from '@nestjs/common';
import { GetDataService } from './get-data.service';

@Controller('get-data')
export class GetDataController {
  constructor(private readonly getDataService: GetDataService) {}

  @Get('all')
  getData() {
    return this.getDataService.getData();
  }

  @Get('bySearchQuery')
  getDatabySearchQuery(@Query('q') searchQuery: string) {
    return this.getDataService.getDataBySearchQuery(searchQuery);
  }

  @Get('exp')
  getDataExp(@Query('q') searchQuery: string) {
    return this.getDataService.getJSONData_experimental();
  }
}
