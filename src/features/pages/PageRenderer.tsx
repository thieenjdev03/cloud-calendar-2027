import type { CalendarEvent, CalendarPage, CalendarProject } from '@/types/calendar';
import { cloudPastel } from '@/themes/cloud-pastel';
import { BackPage } from './BackPage';
import { CoverPage } from './CoverPage';
import { MonthPage } from './MonthPage';
import { FinanceBackPage, FinanceCoverPage, FinanceMonthPage } from './finance/FinancePages';

interface Props {
  page: CalendarPage;
  project: Pick<CalendarProject, 'year' | 'recipientName'> & { themeId?: CalendarProject['themeId'] };
  eventIndex: Map<string, CalendarEvent[]>;
  photoSrc?: string;
  showGuides?: boolean;
}

export function PageRenderer(props: Props) {
  // Theme mới render bằng bộ component riêng; theme cũ đi nguyên nhánh cũ bên dưới.
  if (props.project.themeId === 'chi-dep-tai-chinh') return <FinancePageRenderer {...props} />;
  return <CloudPastelPageRenderer {...props} />;
}

function FinancePageRenderer({ page, project, eventIndex, photoSrc, showGuides }: Props) {
  switch (page.kind) {
    case 'cover':
      return <FinanceCoverPage page={page} year={project.year} recipientName={project.recipientName} photoSrc={photoSrc} showGuides={showGuides} />;
    case 'back':
      return <FinanceBackPage page={page} year={project.year} recipientName={project.recipientName} photoSrc={photoSrc} showGuides={showGuides} />;
    default:
      return <FinanceMonthPage page={page} year={project.year} eventIndex={eventIndex} photoSrc={photoSrc} showGuides={showGuides} />;
  }
}

function CloudPastelPageRenderer({ page, project, eventIndex, photoSrc, showGuides }: Props) {
  const theme = cloudPastel;
  switch (page.kind) {
    case 'cover':
      return (
        <CoverPage page={page} year={project.year} recipientName={project.recipientName} theme={theme} photoSrc={photoSrc} showGuides={showGuides} />
      );
    case 'back':
      return (
        <BackPage page={page} year={project.year} recipientName={project.recipientName} theme={theme} photoSrc={photoSrc} showGuides={showGuides} />
      );
    default:
      return (
        <MonthPage page={page} year={project.year} theme={theme} eventIndex={eventIndex} photoSrc={photoSrc} showGuides={showGuides} />
      );
  }
}

export function pageTitle(page: CalendarPage): string {
  if (page.kind === 'cover') return 'Bìa';
  if (page.kind === 'back') return 'Trang cuối';
  return `Tháng ${page.month}`;
}
