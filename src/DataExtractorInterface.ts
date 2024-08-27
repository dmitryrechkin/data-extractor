import { type TypeDataExtractorError } from './Type';

export interface DataExtractorInterface<TypeInput, TypeResult>
{
	/**
	 * Extracts data from the given input
	 *
	 * @param {TypeInput} input - The input data
	 * @returns {TypeResult} - The extracted data
	 */
	extract(input: TypeInput): Promise<TypeResult | TypeDataExtractorError>;
}
