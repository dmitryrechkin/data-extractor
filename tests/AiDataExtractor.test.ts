import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import dotenv from 'dotenv';
import { createOpenAI } from '@ai-sdk/openai';
import { AiDataExtractor } from '../src/AiDataExtractor';

dotenv.config({path: '.dev.vars'});

const aiProvider = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY!,
	compatibility: 'strict'
});
const aiModel = process.env.OPENAI_MODEL!;

const schema = z.object({
	name: z.string().describe('Full name of the person'),
	date: z.string().describe('Date converted to Y-m-d format'),
	fromTime: z.string().describe('Time in 24 hour format'),
	toTime: z.string().describe('Time in 24 hour format')
});
const extractor = new AiDataExtractor<typeof schema>(aiProvider, aiModel, schema);

describe('AiDataExtractor', () =>
{
	it('should extract data correctly', async () =>
	{
		const input = 'Hi, my name is John Doe. I would like to book a room for 2024-08-15 from 10:00 AM until 2:00 PM.';
		const expectedResult = { name: 'John Doe', date: '2024-08-15', fromTime: '10:00', toTime: '14:00' };

		const result = await extractor.extract(input);

		expect(result).toEqual(expectedResult);
	});
});
