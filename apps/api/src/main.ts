import 'reflect-metadata';import { NestFactory } from '@nestjs/core';import { Module, Controller, Get } from '@nestjs/common';
const modules=['AuthModule','UsersModule','GamesModule','GameVersionsModule','GameLaunchSessionsModule','ScoresModule','LeaderboardsModule','AntiCheatModule','WalletModule','InventoryModule','StoreModule','RewardsModule','AdsModule','AnalyticsModule','AdminModule'];
@Controller('v1') class ApiController{ @Get('health') health(){return {ok:true,service:'lezgamez-api'}} @Get('modules') list(){return {modules,rule:'client never decides wallet, rewards, scores or transactions'}} }
@Module({controllers:[ApiController]}) class AppModule{}
async function bootstrap(){const app=await NestFactory.create(AppModule);app.setGlobalPrefix('api');await app.listen(process.env.PORT||4000)}
bootstrap();
