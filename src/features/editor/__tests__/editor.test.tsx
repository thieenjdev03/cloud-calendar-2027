import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { useProjectStore } from '@/store/project-store';
import { createDefaultProject } from '@/lib/project-io';
import { Canvas } from '../Canvas';
import { PropertiesPanel } from '../PropertiesPanel';
import { Sidebar } from '../Sidebar';

beforeEach(() => {
  useProjectStore.setState({ project: createDefaultProject(), selectedPageId: 'm3', hydrated: true });
});

describe('Editor', () => {
  it('đổi caption ở panel phải thì canvas cập nhật', () => {
    render(
      <>
        <Canvas showGuides={false} />
        <PropertiesPanel />
      </>,
    );
    fireEvent.change(screen.getByLabelText('Caption'), { target: { value: 'Đà Lạt mộng mơ' } });
    expect(within(screen.getByTestId('canvas')).getByText('Đà Lạt mộng mơ')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Lời nhắn'), { target: { value: 'Chúc chị Vân vui' } });
    fireEvent.change(screen.getByLabelText('Người viết'), { target: { value: 'Thiện' } });
    const canvas = within(screen.getByTestId('canvas'));
    expect(canvas.getByText('Chúc chị Vân vui')).toBeInTheDocument();
    expect(canvas.getByText('— Thiện')).toBeInTheDocument();
    expect(canvas.getByText('Tháng 3')).toBeInTheDocument();
  });

  it('import JSON mẫu thì 14 thumbnail hiển đúng trạng thái', async () => {
    const sample = createDefaultProject();
    // Tháng 1: đủ (ảnh nét + caption); Tháng 2: ảnh vỡ (<150dpi); còn lại trống
    sample.pages[1] = { ...sample.pages[1], photoId: 'p1', photoSize: { width: 4000, height: 3000 }, caption: 'Tết' };
    sample.pages[2] = { ...sample.pages[2], photoId: 'p2', photoSize: { width: 640, height: 480 }, caption: 'Zalo' };
    const json = JSON.stringify({ app: 'cloud-calendar', exportedAt: '2026-09-30', project: sample });

    render(<Sidebar />);
    await act(() => useProjectStore.getState().importProject(json));

    const thumbs = screen.getAllByTestId(/^thumb-/);
    expect(thumbs).toHaveLength(14);
    expect(screen.getByTestId('thumb-m1')).toHaveAttribute('data-complete', 'true');
    expect(screen.getByTestId('thumb-m2')).toHaveAttribute('data-complete', 'false');
    expect(screen.getByTestId('thumb-m3')).toHaveAttribute('data-complete', 'false');
    expect(within(screen.getByTestId('thumb-m2')).getByText('78')).toBeInTheDocument(); // DPI đỏ
  });

  it('import file sai cấu trúc thì báo lỗi rõ ràng, không đổi project', async () => {
    const before = useProjectStore.getState().project;
    await expect(useProjectStore.getState().importProject('{"version":2}')).rejects.toThrow('Phiên bản project');
    await expect(useProjectStore.getState().importProject('không phải json')).rejects.toThrow('JSON');
    expect(useProjectStore.getState().project).toBe(before);
  });
});
