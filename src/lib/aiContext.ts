import { FORM_SCHEMA, FormFieldSchema } from './formSchema';

export function findFieldSchema(valueKey: string): FormFieldSchema | undefined {
  for (const section of FORM_SCHEMA) {
    for (const group of section.groups) {
      const field = group.fields.find((f) => f.valueKey === valueKey);
      if (field) return field;
    }
  }
  return undefined;
}

export function resolveMessage(messages: unknown, key: string): string {
  const value = key
    .split('.')
    .reduce<unknown>((acc, part) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined), messages);
  return typeof value === 'string' ? value : '';
}

export function buildIdeaContext(messages: unknown, values: Record<string, string>): string {
  const lines: string[] = [];

  for (const section of FORM_SCHEMA) {
    const sectionTitle = resolveMessage(messages, section.titleKey);

    for (const group of section.groups) {
      const heading = group.headingKey ? resolveMessage(messages, group.headingKey) : undefined;

      for (const field of group.fields) {
        const answer = values[field.valueKey]?.trim();
        if (!answer) continue;

        const fieldTitle = resolveMessage(messages, field.titleKey);
        const label = heading ? `${sectionTitle} > ${heading} > ${fieldTitle}` : `${sectionTitle} > ${fieldTitle}`;
        lines.push(`${label}: ${answer}`);
      }
    }
  }

  return lines.join('\n');
}
