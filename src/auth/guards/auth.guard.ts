import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
	public constructor(private readonly userService: UserService) { }

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()

		if (typeof request.session.userId === 'undefined') throw new UnauthorizedException('Пользователь не авторизован. Пожалуйста, войдите в систему, чтобы получить доступ.')

			const user = await this.userService.findeById(request.session.userId)

			request.user = user

		return true
	}
}