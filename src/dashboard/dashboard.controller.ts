import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('sales-chart')
  getSalesChartData() {
    return this.dashboardService.getSalesChartData();
  }

  @Get('top-products')
  getTopProducts() {
    return this.dashboardService.getTopProducts();
  }

  @Get('recent-sales')
  getRecentSales() {
    return this.dashboardService.getRecentSales();
  }
}
