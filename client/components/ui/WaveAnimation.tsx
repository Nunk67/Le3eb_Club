import { motion } from 'motion/react';

export const WaveAnimation = ({ color = 'bg-black' }: { color?: string }) => (
  <div className="flex items-center gap-0.5 h-3">
    {[1, 2, 3, 4, 5].map(i => (
      <motion.div
        key={i}
        animate={{ height: [4, 12, 4] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
        className={`w-0.5 ${color} rounded-full`}
      />
    ))}
  </div>
);
