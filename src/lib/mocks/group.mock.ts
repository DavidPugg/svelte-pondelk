import type { Group } from '$lib/types/model.types';
import { mockUser, mockUser2 } from './user.mock';

export const mockGroup: Group = {
	id: '1',
	name: 'Test Group',
	author: mockUser,
	createdAt: new Date()
};

export const mockGroup2: Group = {
	id: '2',
	name: 'Test Group 2',
	author: mockUser2,
	createdAt: new Date()
};

export const mockGroups: Group[] = [mockGroup, mockGroup2];
