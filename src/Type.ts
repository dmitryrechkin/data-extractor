export enum EnumDataExtractorErrorType
{
	VALIDATION_ERROR = 'VALIDATION_ERROR',
	PARSE_ERROR = 'PARSE_ERROR',
	UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface TypeDataExtractorError
{
	readonly type: EnumDataExtractorErrorType;
	readonly message: string;
}
