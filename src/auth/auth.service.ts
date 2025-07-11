import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { RegisterDto } from './dto/register.dto'
import { UserService } from 'src/user/user.service'
import { AuthMetod, User } from 'prisma/__generated__'
import { Request, Response } from 'express'
import { LoginDto } from './dto/login.dto'
import { verify } from 'argon2'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
	public constructor(private readonly userService: UserService, private readonly configService: ConfigService) { }

	public async register(req: Request, dto: RegisterDto) {
		const isExist = await this.userService.findeByEmail(dto.email)

		if (isExist) {
			throw new ConflictException('Регистрация не удалась. Пользователь с таким email уже существует.')
		}

		const newUser = await this.userService.create(
			dto.email,
			dto.password,
			dto.name,
			'',
			AuthMetod.CREDENTIALS,
			false
		)

		return this.saveSession(req, newUser)
	}
	public async login(req: Request, dto: LoginDto) { 
		const user = await this.userService.findeByEmail(dto.email)

		if(!user || !user.password){
			throw new NotFoundException("Пользователь не найден. Проверте введеные данные.")
		}

		const isValidPassword = await verify(user.password, dto.password)

		if(!isValidPassword){
			throw new UnauthorizedException("Неверный пароль")
		}

		return this.saveSession(req, user)
	}

	public async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if(err){
					return reject(new InternalServerErrorException('Не удалось завершить сессию. Возможно, возникла проблема с сервером или сессия уже завершена.'))
				}
				res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))
			})
			resolve()
		})
	}

	private async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id

			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException('Не удалось сохранить сессию. Проверте, правильно ли настроины параметры сессии'))
				}
				resolve({user})
			})
		})

	}
}
