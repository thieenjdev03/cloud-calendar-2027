import { fireEvent, render, screen, within } from '@testing-library/react';
import { useProjectStore } from '@/store/project-store';
import { createDefaultProject, parseProjectFile } from '@/lib/project-io';
import { Canvas } from '../Canvas';
import { ThemeSwitch } from '../ThemeSwitch';

beforeEach(() => {
  const project = createDefaultProject();
  project.pages[1] = { ...project.pages[1], caption: 'Tết sum vầy', message: { author: 'Thiện', text: 'Chúc chị' } };
  project.markedDates = [{ id: 'b', date: '2027-01-12', label: 'Sinh nhật chị Vân', color: '#E0607E', isBirthday: true }];
  useProjectStore.setState({ project, selectedPageId: 'm1', hydrated: true });
});

describe('Theme switch', () => {
  it('đổi theme: layout đổi, dữ liệu giữ nguyên', async () => {
    render(
      <>
        <ThemeSwitch />
        <Canvas showGuides={false} />
      </>,
    );
    const canvas = () => within(screen.getByTestId('canvas'));
    expect(canvas().getByText('Tháng 1')).toBeInTheDocument(); // theme cũ
    expect(screen.getByTestId('canvas').querySelector('[data-theme="chi-dep-tai-chinh"]')).toBeNull();

    fireEvent.click(screen.getByRole('radio', { name: /Theme mới/ }));
    expect(useProjectStore.getState().project.themeId).toBe('chi-dep-tai-chinh');
    expect(screen.getByTestId('canvas').querySelector('[data-theme="chi-dep-tai-chinh"]')).not.toBeNull();
    expect(canvas().getByText('THÁNG 1')).toBeInTheDocument();
    expect(canvas().getByText('Tết sum vầy')).toBeInTheDocument();
    expect(canvas().getByText('Chúc chị')).toBeInTheDocument();

    // tháng có sinh nhật → phá format
    expect(canvas().getByText(/Tháng quan trọng nhất năm/)).toBeInTheDocument();
    expect(screen.getByTestId('canvas').querySelector('[data-birthday="true"]')?.getAttribute('data-date')).toBe('2027-01-12');

    fireEvent.click(screen.getByRole('radio', { name: /Theme cũ/ }));
    expect(canvas().getByText('Tháng 1')).toBeInTheDocument();
    expect(canvas().getByText('Tết sum vầy')).toBeInTheDocument();
  });

  it('theme lưu kèm project và qua được import/export', () => {
    const p = createDefaultProject();
    p.themeId = 'chi-dep-tai-chinh';
    expect(parseProjectFile(JSON.stringify({ project: p })).project.themeId).toBe('chi-dep-tai-chinh');
    expect(parseProjectFile(JSON.stringify({ project: { ...p, themeId: 'la' } })).project.themeId).toBe('cloud-pastel');
  });
});
