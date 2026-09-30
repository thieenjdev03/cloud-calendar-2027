import { canChiYear, lunarToSolar, solarToLunarDMY } from '../lunar';
import { toISODate } from '../holidays';

// Nguồn đối chiếu 2027: ngaydep.com/ngay-le-am-lich-va-duong-lich-nam-2027.html
describe('solarToLunar / lunarToSolar (UTC+7)', () => {
  it('Mùng 1 Tết Đinh Mùi 2027 = 06/02/2027', () => {
    expect(solarToLunarDMY(6, 2, 2027)).toEqual({ day: 1, month: 1, year: 2027, isLeapMonth: false });
    expect(toISODate(lunarToSolar(1, 1, 2027)!)).toBe('2027-02-06');
    expect(canChiYear(2027)).toBe('Đinh Mùi');
  });

  it.each([
    [15, 1, '2027-02-20'], // Rằm tháng Giêng
    [10, 3, '2027-04-16'], // Giỗ Tổ
    [15, 8, '2027-09-15'], // Trung thu
  ])('%i/%i âm 2027 = %s', (d, m, iso) => {
    expect(toISODate(lunarToSolar(d, m, 2027)!)).toBe(iso);
  });

  it('Tết Mậu Thân 2028 = 26/01/2028, Tết Bính Ngọ 2026 = 17/02/2026', () => {
    expect(toISODate(lunarToSolar(1, 1, 2028)!)).toBe('2028-01-26');
    expect(toISODate(lunarToSolar(1, 1, 2026)!)).toBe('2026-02-17');
  });

  it('xử lý tháng nhuận: 2023 nhuận tháng 2, 2025 nhuận tháng 6', () => {
    // 22/03/2023 = mùng 1 tháng 2 nhuận Quý Mão
    expect(solarToLunarDMY(22, 3, 2023)).toEqual({ day: 1, month: 2, year: 2023, isLeapMonth: true });
    expect(toISODate(lunarToSolar(1, 6, 2025, true)!)).toBe('2025-07-25');
    expect(lunarToSolar(1, 5, 2025, true)).toBeNull();
    // 2027 không có tháng nhuận
    expect(lunarToSolar(1, 1, 2027, true)).toBeNull();
  });

  it('Tết 1985 theo lịch Việt (UTC+7) là 21/01, lịch Trung Quốc (UTC+8) là 20/02', () => {
    expect(toISODate(lunarToSolar(1, 1, 1985, false, 7)!)).toBe('1985-01-21');
    expect(toISODate(lunarToSolar(1, 1, 1985, false, 8)!)).toBe('1985-02-20');
  });

  it('round-trip mọi ngày trong 2027', () => {
    for (let d = new Date(2027, 0, 1); d.getFullYear() === 2027; d.setDate(d.getDate() + 1)) {
      const l = solarToLunarDMY(d.getDate(), d.getMonth() + 1, d.getFullYear());
      const back = lunarToSolar(l.day, l.month, l.year, l.isLeapMonth)!;
      expect(toISODate(back)).toBe(toISODate(d));
    }
  });
});
