// The expected shape of a user returned by the API: field name -> JavaScript type.
// A small hand-written schema keeps the project free of extra libraries.
export const USER_SCHEMA: Record<string, 'string' | 'number' | 'object'> = {
  id: 'number',
  name: 'string',
  username: 'string',
  email: 'string',
  phone: 'string',
  website: 'string',
  address: 'object',
  company: 'object',
};

// Returns a list of problems; an empty list means the body matches the schema.
// Tests assert expect(validateAgainstSchema(body, USER_SCHEMA)).toEqual([]),
// so a failure prints exactly which fields are wrong.
export function validateAgainstSchema(
  body: unknown,
  schema: Record<string, string>
): string[] {
  if (typeof body !== 'object' || body === null) {
    return ['body is not an object'];
  }
  const record = body as Record<string, unknown>;
  const errors: string[] = [];
  for (const [field, expectedType] of Object.entries(schema)) {
    if (!(field in record)) {
      errors.push(`missing field "${field}"`);
    } else if (typeof record[field] !== expectedType) {
      errors.push(`field "${field}" should be ${expectedType} but is ${typeof record[field]}`);
    }
  }
  return errors;
}
