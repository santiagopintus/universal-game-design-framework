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

export function parseIdeaExport(raw: string): IdeaExport | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof (parsed as Record<string, unknown>).values !== 'object' ||
      (parsed as Record<string, unknown>).values === null
    ) {
      return null;
    }

    const { ideaTitle, values } = parsed as Record<string, unknown>;
    const valuesRecord = values as Record<string, unknown>;
    const cleanValues: Record<string, string> = {};
    for (const [key, value] of Object.entries(valuesRecord)) {
      if (typeof value === 'string') cleanValues[key] = value;
    }

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
