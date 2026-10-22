/**
 * Advanced SVG Processing Engine for NPC-Svg-Studio
 */

export function extractColors(svgString) {
  if (!svgString) return [];
  const colorSet = new Set();
  
  // 仅匹配标准的 3/6 位纯色 Hex 或 rgb/hsl 格式，过滤掉已经带了透明度的 8 位 Hex，避免重复分割
  const colorPattern = /(#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b|rgba?\([^)]+\)|hsla?\([^)]+\))/gi;
  const namedColors = /\b(black|white|red|blue|green|yellow|orange|purple|pink|cyan|magenta|gray|grey|brown)\b/gi;

  const matches = svgString.match(colorPattern) || [];
  const namedMatches = svgString.match(namedColors) || [];

  [...matches, ...namedMatches].forEach((col) => {
    const cleanCol = col.trim().toLowerCase();
    if (cleanCol && cleanCol !== 'none' && !cleanCol.startsWith('url(')) {
      // 如果是 4 位简写 Hex (#rgb) 统一转成 6 位 (#rrggbb) 方便后续加透明度后缀
      let normalized = cleanCol;
      if (normalized.startsWith('#') && normalized.length === 4) {
        normalized = `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`;
      }
      colorSet.add(normalized);
    }
  });

  // 检测隐式黑色
  const shapeTagRegex = /<(path|rect|circle|polygon|polyline|ellipse)\b([^>]*)\/?>/gi;
  let hasImplicitBlack = false;

  let match;
  while ((match = shapeTagRegex.exec(svgString)) !== null) {
    const attrs = match[2];
    const hasFill = /fill\s*=/i.test(attrs);
    const hasStroke = /stroke\s*=/i.test(attrs);
    const hasClass = /class\s*=/i.test(attrs);
    const hasStyle = /style\s*=/i.test(attrs);

    if (!hasFill && !hasStroke && !hasClass && !hasStyle) {
      hasImplicitBlack = true;
      break;
    }
  }

  if (hasImplicitBlack) {
    colorSet.add('#000000');
  }

  return Array.from(colorSet);
}

/**
 * 绝对精准的单色属性替换（完全杜绝颜色互串）
 */
export function replaceColor(svgString, targetColor, newColor) {
  if (!svgString || !targetColor || !newColor) return svgString;

  let updatedSvg = svgString;

  // 处理隐式黑色
  const isBlackTarget = targetColor.toLowerCase() === '#000000' || targetColor.toLowerCase() === 'black';
  if (isBlackTarget) {
    updatedSvg = updatedSvg.replace(
      /<(path|rect|circle|polygon|polyline|ellipse)\b((?:(?!fill=)[^>])*)>/gi,
      (match, tag, attrs) => {
        if (!/fill\s*=/i.test(attrs) && !/class\s*=/i.test(attrs)) {
          return `<${tag}${attrs} fill="${newColor}">`;
        }
        return match;
      }
    );
  }

  // 严格匹配引号包裹的颜色值属性（如 fill="#xxxxxx" 或 fill="#xxxxxx[xx]"）
  const baseClean = targetColor.slice(0, 7); // 取 6 位基础色进行匹配
  const escapedBase = baseClean.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  
  // 匹配形如 fill="#6366f1" 或前面已经被加过透明度的 fill="#6366f1xx"
  const attrRegex = new RegExp(`(fill|stroke|stop-color|flood-color)\\s*=\\s*(["'])(${escapedBase}[0-9a-fA-F]{0,2})\\2`, 'gi');
  updatedSvg = updatedSvg.replace(attrRegex, `$1=$2${newColor}$2`);

  // 匹配 style 内部的颜色
  const styleRegex = new RegExp(`(fill|stroke|color)\\s*:\\s*(${escapedBase}[0-9a-fA-F]{0,2})\\b`, 'gi');
  updatedSvg = updatedSvg.replace(styleRegex, `$1: ${newColor}`);

  return updatedSvg;
}

export function optimizeSvgWithOptions(svgString, options = {}) {
  if (!svgString) return '';
  let clean = svgString;

  if (options.removeComments !== false) {
    clean = clean.replace(/<!--[\s\S]*?-->/g, '');
  }
  if (options.removeMetadata !== false) {
    clean = clean.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
    clean = clean.replace(/<\?xml.*?\?>/g, '');
    clean = clean.replace(/<!DOCTYPE.*?>/gi, '');
  }
  if (options.removeEditorData !== false) {
    clean = clean.replace(/\s(xmlns:sketch|sketch:type|i:extraneous|xmlns:serif|serif:id|data-name)="[^"]*"/gi, '');
  }
  if (options.removeEmptyAttrs !== false) {
    clean = clean.replace(/\s[a-z-]+=""/gi, '');
  }
  if (options.collapseWhitespace !== false) {
    clean = clean.replace(/>\s+</g, '><').replace(/\s+/g, ' ');
  }

  return clean.trim();
}

export function convertToReactComponent(svgString, componentName = 'IconSvg') {
  if (!svgString) return '';
  let jsx = svgString
    .replace(/class=/g, 'className=')
    .replace(/stroke-width=/g, 'strokeWidth=')
    .replace(/stroke-linecap=/g, 'strokeLinecap=')
    .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/fill-rule=/g, 'fillRule=')
    .replace(/clip-rule=/g, 'clipRule=');

  return `import React, { forwardRef } from 'react';\n\nexport const ${componentName} = forwardRef((props, ref) => (\n  ${jsx.replace('<svg ', '<svg ref={ref} {...props} ')}\n));`;
}

export function convertToVueComponent(svgString, componentName = 'IconSvg') {
  if (!svgString) return '';
  return `<template>\n  ${svgString}\n</template>\n\n<script setup>\n// ${componentName} Vue 3 Component\n</script>`;
}

export function convertToSvelteComponent(svgString) {
  if (!svgString) return '';
  return `<script>\n  export let customClass = '';\n</script>\n\n${svgString}`;
}

export function convertToCssDataUri(svgString) {
  if (!svgString) return '';
  const encoded = encodeURIComponent(optimizeSvgWithOptions(svgString))
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `background-image: url("data:image/svg+xml;utf8,${encoded}");`;
}
