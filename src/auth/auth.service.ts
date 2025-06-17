import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthService {
	public constructor(private readonly userService: UserService){}

	public async register(dto: RegisterDto) {
		const user = await this.userService.findeByEmail(dto.email)
		
	}
	public async login(){}
	public async logout(){}
	private async saveSession(){}
}
