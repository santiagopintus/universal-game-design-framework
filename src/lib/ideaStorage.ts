export interface SavedIdea {
  id: string;
  ideaTitle: string;
  updatedAt: string;
  values: Record<string, string>;
  deletedAt?: string | null;
}

const STORAGE_KEY = 'ugdf.ideas.v1';

function getAllIdeasLocal(): SavedIdea[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const ideas = raw ? (JSON.parse(raw) as SavedIdea[]) : [];
    return ideas.map((idea) => ({ ...idea, deletedAt: idea.deletedAt ?? null }));
  } catch {
    return [];
  }
}

function setAllIdeasLocal(ideas: SavedIdea[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
}

function saveIdeaLocal(idea: SavedIdea): void {
  const ideas = getAllIdeasLocal();
  const index = ideas.findIndex((i) => i.id === idea.id);
  if (index >= 0) {
    ideas[index] = idea;
  } else {
    ideas.push(idea);
  }
  setAllIdeasLocal(ideas);
}

// Signed-in requests use the server as the source of truth and mirror the
// result into localStorage as an offline cache. If the network call fails,
// callers fall back to the local cache. Offline writes made while signed in
// are not queued/retried in this first pass.

export async function getAllIdeas(isSignedIn: boolean): Promise<SavedIdea[]> {
  if (!isSignedIn) return getAllIdeasLocal();

  try {
    const res = await fetch('/api/ideas');
    if (!res.ok) throw new Error('Failed to fetch ideas');
    const ideas = (await res.json()) as SavedIdea[];
    setAllIdeasLocal(ideas);
    return ideas;
  } catch (err) {
    console.warn('Falling back to local idea cache:', err);
    return getAllIdeasLocal();
  }
}

export async function getIdea(id: string, isSignedIn: boolean): Promise<SavedIdea | undefined> {
  if (!isSignedIn) return getAllIdeasLocal().find((idea) => idea.id === id);

  try {
    const res = await fetch(`/api/ideas/${id}`);
    if (res.status === 404) return undefined;
    if (!res.ok) throw new Error('Failed to fetch idea');
    const idea = (await res.json()) as SavedIdea;
    saveIdeaLocal(idea);
    return idea;
  } catch (err) {
    console.warn('Falling back to local idea cache:', err);
    return getAllIdeasLocal().find((idea) => idea.id === id);
  }
}

export async function saveIdea(idea: SavedIdea, isSignedIn: boolean): Promise<void> {
  if (!isSignedIn) {
    saveIdeaLocal(idea);
    return;
  }

  try {
    const isExisting = (await getIdea(idea.id, true)) !== undefined;
    const res = await fetch(isExisting ? `/api/ideas/${idea.id}` : '/api/ideas', {
      method: isExisting ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: idea.id, ideaTitle: idea.ideaTitle, values: idea.values }),
    });
    if (!res.ok) throw new Error('Failed to save idea');
    const saved = (await res.json()) as SavedIdea;
    saveIdeaLocal(saved);
  } catch (err) {
    console.warn('Failed to sync idea, saving locally only:', err);
    saveIdeaLocal(idea);
  }
}

export async function softDeleteIdea(id: string, isSignedIn: boolean): Promise<void> {
  if (!isSignedIn) {
    const idea = getAllIdeasLocal().find((i) => i.id === id);
    if (idea) saveIdeaLocal({ ...idea, deletedAt: new Date().toISOString() });
    return;
  }

  try {
    const res = await fetch(`/api/ideas/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete idea');
    const idea = (await res.json()) as SavedIdea;
    saveIdeaLocal(idea);
  } catch (err) {
    console.warn('Failed to sync delete, updating local cache only:', err);
    const idea = getAllIdeasLocal().find((i) => i.id === id);
    if (idea) saveIdeaLocal({ ...idea, deletedAt: new Date().toISOString() });
  }
}

export async function restoreIdea(id: string, isSignedIn: boolean): Promise<void> {
  if (!isSignedIn) {
    const idea = getAllIdeasLocal().find((i) => i.id === id);
    if (idea) saveIdeaLocal({ ...idea, deletedAt: null });
    return;
  }

  try {
    const res = await fetch(`/api/ideas/${id}/restore`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to restore idea');
    const idea = (await res.json()) as SavedIdea;
    saveIdeaLocal(idea);
  } catch (err) {
    console.warn('Failed to sync restore, updating local cache only:', err);
    const idea = getAllIdeasLocal().find((i) => i.id === id);
    if (idea) saveIdeaLocal({ ...idea, deletedAt: null });
  }
}

export async function deleteIdeaForever(id: string, isSignedIn: boolean): Promise<void> {
  if (isSignedIn) {
    try {
      const res = await fetch(`/api/ideas/${id}/permanent`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to permanently delete idea');
    } catch (err) {
      console.warn('Failed to sync permanent delete:', err);
    }
  }
  setAllIdeasLocal(getAllIdeasLocal().filter((idea) => idea.id !== id));
}

// Uploads every idea currently cached in localStorage to the signed-in
// user's account. Used by the opt-in "import your local ideas" prompt —
// never called automatically.
export async function bulkImportLocalIdeas(): Promise<SavedIdea[]> {
  const local = getAllIdeasLocal();
  if (local.length === 0) return [];

  const res = await fetch('/api/ideas/bulk-import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(local),
  });
  if (!res.ok) throw new Error('Failed to import local ideas');
  const imported = (await res.json()) as SavedIdea[];
  setAllIdeasLocal(imported);
  return imported;
}

export function getLocalIdeaCount(): number {
  return getAllIdeasLocal().length;
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

export async function importIdea(data: IdeaExport, isSignedIn: boolean): Promise<SavedIdea> {
  const idea: SavedIdea = {
    id: crypto.randomUUID(),
    ideaTitle: data.ideaTitle,
    values: data.values,
    updatedAt: new Date().toISOString(),
  };
  await saveIdea(idea, isSignedIn);
  return idea;
}
