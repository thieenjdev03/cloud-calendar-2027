import { buildMonthGrid, GRID_WEEKS } from '../month-grid';
import { eventsForYear } from '../holidays';

describe('holidays 2027', () => {
  const events = eventsForYear(2027, [
    { id: 'bd', date: '2027-05-12', label: 'Sinh nhật chị Vân', color: '#f7a8c4', icon: 'heart' },
  ]);
  const find = (label: string) => events.find((e) => e.label === label)?.date;

  it('chuyển đúng lễ âm sang dương', () => {
    expect(find('Mùng 1 Tết')).toBe('2027-02-06');
    expect(find('Mùng 3 Tết')).toBe('2027-02-08');
    expect(find('Giao thừa')).toBe('2027-02-05');
    expect(find('Ông Công Ông Táo')).toBe('2027-01-30');
    expect(find('Rằm tháng Giêng')).toBe('2027-02-20');
    expect(find('Giỗ Tổ Hùng Vương')).toBe('2027-04-16');
    expect(find('Trung thu')).toBe('2027-09-15');
  });

  it('có lễ dương + ngày đánh dấu riêng', () => {
    expect(find('Quốc khánh')).toBe('2027-09-02');
    expect(events.find((e) => e.date === '2027-05-12')?.type).toBe('custom');
  });
});

describe('buildMonthGrid', () => {
  it('luôn 6 hàng × 7 ngày, bắt đầu thứ Hai', () => {
    for (let m = 1; m <= 12; m++) {
      const grid = buildMonthGrid(2027, m);
      expect(grid).toHaveLength(GRID_WEEKS);
      grid.forEach((w) => expect(w).toHaveLength(7));
      expect(grid[0][0].weekday).toBe(1);
    }
  });

  it('tháng bắt đầu Chủ nhật: ô đầu là thứ Hai tuần trước (08/2027)', () => {
    // 01/08/2027 là Chủ nhật
    const grid = buildMonthGrid(2027, 8);
    expect(grid[0][0].date).toBe('2027-07-26');
    expect(grid[0][6].date).toBe('2027-08-01');
    expect(grid[0][6].isSunday).toBe(true);
    expect(grid[0][0].isCurrentMonth).toBe(false);
  });

  it('nhãn âm lịch rút gọn: mùng 1 và ô đầu lưới hiện tháng', () => {
    const feb = buildMonthGrid(2027, 2);
    const tet = feb.flat().find((c) => c.date === '2027-02-06')!;
    expect(tet.lunarLabel).toBe('1/1');
    expect(tet.events.map((e) => e.label)).toContain('Mùng 1 Tết');
    const next = feb.flat().find((c) => c.date === '2027-02-07')!;
    expect(next.lunarLabel).toBe('2');
    expect(feb[0][0].lunarLabel).toMatch(/\d+\/\d+/);
  });
});
