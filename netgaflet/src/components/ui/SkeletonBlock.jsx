export default function SkeletonBlock({ width = '100%', height = '16px', borderRadius = '8px', style = {} }) {
  return (
    <div
      className="shimmer"
      style={{
        width,
        height,
        borderRadius,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
