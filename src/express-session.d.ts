import 'express-session'

declare module 'express-session' {
	interface SessionDta{
		userId?: string
	}
}