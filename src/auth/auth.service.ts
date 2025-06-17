import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto'
import { UserService } from 'src/user/user.service'
import { AuthMetod, User } from 'prisma/__generated__'

@Injectable()
export class AuthService {
	public constructor(private readonly userService: UserService){}

	public async register(dto: RegisterDto) {
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

		return this.saveSession(newUser);
	}
	public async login(){}
	public async logout(){}
	private async saveSession(user: User) {
		console.log('Session saved. User: ', user);
	}
}
