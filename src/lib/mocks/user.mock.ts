import type { User } from '$lib/types/model.types';

export const mockUser: User = {
	id: 1,
	sub: '1234',
	authType: 'google',
	username: 'John Doe',
	picture: 'https://i.pravatar.cc/300',
	email: 'test@gmail.com',
	createdAt: new Date()
};

export const mockUser2: User = {
	id: 1,
	sub: '123',
	authType: 'google',
	username: 'Jane Doe',
	picture: 'https://i.pravatar.cc/300',
	email: 'test2@gmail.com',
	createdAt: new Date()
};

export const mockUsers: User[] = [mockUser, mockUser2];
