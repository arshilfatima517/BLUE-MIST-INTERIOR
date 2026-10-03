interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  light?: boolean;
}

export default function SectionTitle({
  eyebrow,
  title,
  description,
  center = false,
  light = false,
}: SectionTitleProps) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <p
          className={`font-sans-ui text-xs tracking-[0.3em] uppercase mb-4 ${
            light ? 'text-[#c9a973]' : 'text-[#b8945f]'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-4xl md:text-5xl font-serif leading-[1.15] ${
          light ? 'text-white' : 'text-[#3d3327]'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 font-sans-ui text-base leading-relaxed ${
            light ? 'text-white/70' : 'text-[#5c4e3d]/70'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
