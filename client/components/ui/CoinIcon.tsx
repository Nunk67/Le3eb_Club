export const CoinIcon = ({
  className = 'w-3 h-3',
  textClassName = 'text-[8px]',
}: {
  className?: string;
  textClassName?: string;
}) => (
  <span className={`${className} rounded-full bg-yellow-500 inline-flex items-center justify-center shrink-0`}>
    <span className={`${textClassName} text-black font-black leading-none`}>C</span>
  </span>
);
