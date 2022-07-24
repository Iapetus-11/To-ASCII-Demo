export default function RangeInput({ name, defaultValue, min, max, changeHook, endChangeHook }) {
  return (
    <div className="flex flex-row space-x-2 justify-between">
      <span className="text-white pb-1">{name}</span>
      <input
        type="range"
        defaultValue={defaultValue}
        onChange={(e) => changeHook(e.target.value)}
        onMouseUp={(e) => endChangeHook()}
        onTouchEnd={(e) => endChangeHook()}
        min={min}
        max={max}
        step="0.05"
      />
    </div>
  );
}
