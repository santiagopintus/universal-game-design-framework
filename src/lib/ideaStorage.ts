export interface SavedIdea {
  id: string;
  ideaTitle: string;
  updatedAt: string;
  values: Record<string, string>;
}

const STORAGE_KEY = 'ugdf.ideas.v1';

export function getAllIdeas(): SavedIdea[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedIdea[]) : [];
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
