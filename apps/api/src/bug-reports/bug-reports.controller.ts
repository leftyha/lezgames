import { Body, Controller, Post } from '@nestjs/common';
import { BugReportsService } from './bug-reports.service';
import { CreateBugReportDto } from './dto/create-bug-report.dto';

@Controller('v1/bug-reports')
export class BugReportsController {
  constructor(private readonly reports: BugReportsService) {}

  @Post()
  create(@Body() body: CreateBugReportDto) {
    return this.reports.create(body);
  }
}
