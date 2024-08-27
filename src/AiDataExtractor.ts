import { type ZodSchema, type infer as Infer  } from 'zod';
import { type OpenAIProvider } from '@ai-sdk/openai';
import { JSONParseError, TypeValidationError, generateObject } from 'ai';
import { type DataExtractorInterface } from './DataExtractorInterface';
import { EnumDataExtractorErrorType, type TypeDataExtractorError } from './Type';

export class AiDataExtractor<TypeSchema extends ZodSchema> implements DataExtractorInterface<string, Infer<TypeSchema>>
{
	/**
	 * Creates a new instance of the AI data extractor.
	 *
	 * @param {OpenAIProvider} aiProvider - The AI provider to use.
	 * @param {string} aiModel - The AI model to use.
	 * @param {TypeSchema} schema - The Zod schema defining the structure of the output data.
	 */
	public constructor(
		private aiProvider: OpenAIProvider,
		private aiModel: string,
		private schema: TypeSchema
	) {}

	/**
	 * Extracts data using AI based on the provided schema.
	 *
	 * @param {string} input - The input text to process.
	 * @returns {Promise<TypeResult | TypeDataExtractorError>} - The extracted data according to the schema.
	 */
	public async extract(input: string): Promise<Infer<TypeSchema> | TypeDataExtractorError>
	{
		try
		{
			// Generate object using the AI provider
			const result = await generateObject<Infer<TypeSchema>>({
				model: this.aiProvider(this.aiModel),
				schema: this.schema,
				prompt: `Extract the following data from the given text, please try to find the best matching values for the fields:\n\n${input}`
			});

			return result.object;
		}
		catch (error)
		{
			return this.handleError(error);
		}
	}

	/**
	 * Handles errors during the extraction process.
	 *
	 * @param {unknown} error - The error object to process.
	 * @returns {TypeDataExtractorError} - The processed error.
	 */
	private handleError(error: unknown): TypeDataExtractorError
	{
		if (TypeValidationError.isInstance(error))
		{
			return { type: EnumDataExtractorErrorType.VALIDATION_ERROR, message: (error as {value: string}).value };
		}

		if (JSONParseError.isInstance(error))
		{
			return { type: EnumDataExtractorErrorType.PARSE_ERROR, message: (error as {text: string}).text };
		}

		return { type: EnumDataExtractorErrorType.UNKNOWN_ERROR, message: String(error) };
	}
}
