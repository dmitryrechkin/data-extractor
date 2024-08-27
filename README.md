
# Data Extractor

**Data Extractor is a TypeScript library designed to facilitate the extraction of structured data from text using AI and schema validation.** This library leverages AI models and Zod schemas to accurately parse and validate data from input text.

## Installation

Install the package using pnpm:

```bash
pnpm add @dmitryrechkin/data-extractor
```

## Features

- **AI-Powered Extraction**: Utilizes AI models to extract structured data from unstructured text.
- **Schema Validation**: Ensures extracted data conforms to a defined Zod schema.
- **Error Handling**: Provides detailed error types including validation errors, parsing errors, and unknown errors.

## Usage

### Setting Up AI Data Extraction

```typescript
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import { AiDataExtractor } from '@dmitryrechkin/data-extractor';

// Set up the AI provider and model
const aiProvider = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY!,
	compatibility: 'strict'
});
const aiModel = process.env.OPENAI_MODEL!;

// Define the schema for the expected data structure
const schema = z.object({
	name: z.string().describe('Full name of the person'),
	date: z.string().describe('Date converted to Y-m-d format'),
	fromTime: z.string().describe('Time in 24 hour format'),
	toTime: z.string().describe('Time in 24 hour format')
});

// Create an instance of AiDataExtractor with the schema
const extractor = new AiDataExtractor<typeof schema>(aiProvider, aiModel, schema);
```

### Extracting Data from Text

```typescript
const input = 'Hi, my name is John Doe. I would like to book a room for 2024-08-15 from 10:00 AM until 2:00 PM.';
const expectedResult = { name: 'John Doe', date: '2024-08-15', fromTime: '10:00', toTime: '14:00' };

// Extract data using the AI extractor
const result = await extractor.extract(input);

console.log(result);
// Output: { name: 'John Doe', date: '2024-08-15', fromTime: '10:00', toTime: '14:00' }
```

### Handling Errors

The `AiDataExtractor` handles errors that may occur during data extraction. Errors are returned as objects containing a type and message:

```typescript
import { EnumDataExtractorErrorType } from '@dmitryrechkin/data-extractor';

const result = await extractor.extract('Invalid input data');

if ('type' in result) {
    switch (result.type) {
        case EnumDataExtractorErrorType.VALIDATION_ERROR:
            console.error('Validation Error:', result.message);
            break;
        case EnumDataExtractorErrorType.PARSE_ERROR:
            console.error('Parse Error:', result.message);
            break;
        default:
            console.error('Unknown Error:', result.message);
    }
}
```

## When to Use

This library is ideal for projects that require extracting structured data from unstructured text, such as:

- **Data Parsing Pipelines**: Automatically parse and validate data from textual inputs.
- **AI-Driven Applications**: Use AI models to intelligently extract relevant information from user inputs.
- **Schema Validation**: Ensure data extracted from text meets your application’s requirements.

## Installation & Setup

Install the package using pnpm:

```bash
pnpm add @dmitryrechkin/data-extractor
```

Ensure that your project is set up to handle TypeScript and supports ES modules, as this library is built with modern JavaScript standards.

## Contributing

Contributions are welcome! Feel free to fork this project and submit pull requests. Before submitting, please ensure your code passes all linting and unit tests.

You can run unit tests using:

```bash
pnpm test
```
