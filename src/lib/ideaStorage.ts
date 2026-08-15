export interface SavedIdea {
  id: string;
  ideaTitle: string;
  updatedAt: string;
  values: Record<string, string>;
  deletedAt?: string | null;
}

const STORAGE_KEY = 'ugdf.ideas.v1';

export function getAllIdeas(): SavedIdea[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const ideas = raw ? (JSON.parse(raw) as SavedIdea[]) : [];
    return ideas.map((idea) => ({ ...idea, deletedAt: idea.deletedAt ?? null }));
  } catch {
    return [];
  }
}

export function getIdea(id: string): SavedIdea | undefined {
  return getAllIdeas().find((idea) => idea.id === id);
}

export function saveIdea(idea: SavedIdea): void {
  const ideas = getAllIdeas();
  const index = ideas.findIndex((i) => i.id === idea.id);
  if (index >= 0) {
    ideas[index] = idea;
  } else {
    ideas.push(idea);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
}

export function softDeleteIdea(id: string): void {
  const idea = getIdea(id);
  if (!idea) return;
  saveIdea({ ...idea, deletedAt: new Date().toISOString() });
}

export function restoreIdea(id: string): void {
  const idea = getIdea(id);
  if (!idea) return;
  saveIdea({ ...idea, deletedAt: null });
}

export function deleteIdeaForever(id: string): void {
  const ideas = getAllIdeas().filter((idea) => idea.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
}

export interface IdeaExport {
  ideaTitle: string;
  values: Record<string, string>;
}

function extractValuesFromSections(sections: unknown): Record<string, string> | null {
  if (!Array.isArray(sections)) return null;

  const cleanValues: Record<string, string> = {};
  for (const section of sections) {
    if (typeof section !== 'object' || section === null) return null;
    const groups = (section as Record<string, unknown>).groups;
    if (!Array.isArray(groups)) return null;

    for (const group of groups) {
      if (typeof group !== 'object' || group === null) return null;
      const fields = (group as Record<string, unknown>).fields;
      if (!Array.isArray(fields)) return null;

      for (const field of fields) {
        if (typeof field !== 'object' || field === null) return null;
        const { valueKey, answer } = field as Record<string, unknown>;
        if (typeof valueKey !== 'string') return null;
        if (typeof answer === 'string' && answer !== '') cleanValues[valueKey] = answer;
      }
    }
  }

  return cleanValues;
}

export function parseIdeaExport(raw: string): IdeaExport | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;

    const { ideaTitle, values, sections } = parsed as Record<string, unknown>;

    let cleanValues: Record<string, string> | null = null;

    if (typeof values === 'object' && values !== null) {
      cleanValues = {};
      for (const [key, value] of Object.entries(values as Record<string, unknown>)) {
        if (typeof value === 'string') cleanValues[key] = value;
      }
    } else if (sections !== undefined) {
      cleanValues = extractValuesFromSections(sections);
    }

    if (cleanValues === null) return null;

    return {
      ideaTitle: typeof ideaTitle === 'string' ? ideaTitle : '',
      values: cleanValues,
    };
  } catch {
    return null;
  }
}

export function importIdea(data: IdeaExport): SavedIdea {
  const idea: SavedIdea = {
    id: crypto.randomUUID(),
    ideaTitle: data.ideaTitle,
    values: data.values,
    updatedAt: new Date().toISOString(),
  };
  saveIdea(idea);
  return idea;
}
