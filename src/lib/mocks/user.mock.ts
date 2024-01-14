import type { User } from '$lib/types/model.types';

export const mockUser: User = {
	id: '1',
	name: 'John Doe',
	avatar: 'https://i.pravatar.cc/300',
	email: 'test@gmail.com',
	createdAt: new Date()
};

export const mockUser2: User = {
	id: '2',
	name: 'Jane Doe',
	avatar: 'https://i.pravatar.cc/300',
	email: 'test2@gmail.com',
	createdAt: new Date()
};

export const mockUsers: User[] = [mockUser, mockUser2];
