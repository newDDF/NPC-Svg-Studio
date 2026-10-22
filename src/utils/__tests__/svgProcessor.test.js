import { describe, it, expect } from 'vitest';
import { optimizeSvg, extractColors, replaceColor } from '../svgProcessor';

describe('SVG Processor Utilities', () => {
  const sampleSvg = `
    <!-- Created with Sketch -->
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" width="24" height="24" viewBox="0 0 24 24">
      <path fill="#FF0000" stroke="#000000" d="M12 2L2 22h20L12 2z"/>
      <circle cx="12" cy="12" r="5" fill="#ff0000" style="stroke: #000000;" />
    </svg>
  `;

  it('should clean comments and sketch attributes correctly', () => {
    const optimized = optimizeSvg(sampleSvg);
    expect(optimized).not.toContain('Created with Sketch');
    expect(optimized).not.toContain('xmlns:sketch');
    expect(optimized.startsWith('<svg')).toBe(true);
  });

  it('should extract unique valid colors from SVG', () => {
    const colors = extractColors(sampleSvg);
    expect(colors).toContain('#FF0000');
    expect(colors).toContain('#000000');
    expect(colors).not.toContain('none');
  });

  it('should replace target color with new color', () => {
    const result = replaceColor(sampleSvg, '#FF0000', '#00FF00');
    expect(result).toContain('#00FF00');
    expect(result).not.toContain('fill="#FF0000"');
  });
});
