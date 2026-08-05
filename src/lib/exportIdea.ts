import { FORM_SCHEMA } from './formSchema';

type Translate = (key: string) => string;

export function slugifyFilename(title: string, fallback: string): string {
  const base = title.trim() || fallback;
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || fallback;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function buildMarkdown(
  t: Translate,
  ideaTitle: string,
  values: Record<string, string>,
  untitledLabel: string,
  noAnswerLabel: string,
): string {
  const lines: string[] = [`# ${ideaTitle.trim() || untitledLabel}`, ''];

  for (const section of FORM_SCHEMA) {
    lines.push(`## ${t(section.titleKey)}`, '');

    for (const group of section.groups) {
      if (group.headingKey) {
        lines.push(`### ${t(group.headingKey)}`, '');
      }

      for (const field of group.fields) {
        lines.push(`**${t(field.titleKey)}**`, '');
        lines.push(`_${t(field.guideKey)}_`, '');
        lines.push(values[field.valueKey]?.trim() || noAnswerLabel, '');
      }
    }
  }

  return lines.join('\n');
}

export function downloadMarkdown(
  t: Translate,
  ideaTitle: string,
  values: Record<string, string>,
  untitledLabel: string,
  noAnswerLabel: string,
): void {
  const markdown = buildMarkdown(t, ideaTitle, values, untitledLabel, noAnswerLabel);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  triggerDownload(blob, `${slugifyFilename(ideaTitle, untitledLabel)}.md`);
}

export function downloadJson(
  ideaTitle: string,
  values: Record<string, string>,
  untitledLabel: string,
): void {
  const json = JSON.stringify({ ideaTitle, values }, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  triggerDownload(blob, `${slugifyFilename(ideaTitle, untitledLabel)}.json`);
}

export async function downloadPdf(
  t: Translate,
  ideaTitle: string,
  values: Record<string, string>,
  untitledLabel: string,
  noAnswerLabel: string,
): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (lineHeight: number) => {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const writeLines = (text: string, fontSize: number, fontStyle: 'normal' | 'bold' | 'italic', gapAfter: number) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    const lines: string[] = doc.splitTextToSize(text, maxWidth);
    const lineHeight = fontSize * 1.35;
    for (const line of lines) {
      ensureSpace(lineHeight);
      doc.text(line, margin, y);
      y += lineHeight;
    }
    y += gapAfter;
  };

  writeLines(ideaTitle.trim() || untitledLabel, 22, 'bold', 16);

  for (const section of FORM_SCHEMA) {
    writeLines(t(section.titleKey), 16, 'bold', 8);

    for (const group of section.groups) {
      if (group.headingKey) {
        writeLines(t(group.headingKey), 13, 'bold', 6);
      }

      for (const field of group.fields) {
        writeLines(t(field.titleKey), 12, 'bold', 2);
        writeLines(t(field.guideKey), 10, 'italic', 4);
        writeLines(values[field.valueKey]?.trim() || noAnswerLabel, 11, 'normal', 12);
      }
    }
  }

  doc.save(`${slugifyFilename(ideaTitle, untitledLabel)}.pdf`);
}
