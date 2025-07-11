import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from 'prisma/__generated__'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { UserService } from 'src/user/user.service'
import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
	public constructor(private readonly userService: UserService) { }

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest() as Request

		if (typeof request.session.userId === 'undefined') throw new UnauthorizedException('Пользователь не авторизован. Пожалуйста, войдите в систему, чтобы получить доступ.')

		return true
	}
}