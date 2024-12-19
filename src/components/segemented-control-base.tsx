import { useRef, useState, useEffect } from 'react';

import { Button } from '@nextui-org/react';

import './segmented-control.css';

type SegmentItem = {
  label: string;
  value: string;
  ref: React.MutableRefObject<HTMLDivElement | null>;
};

interface Props {
  name: string;
  segments: SegmentItem[];
  callback: (v: string) => void;
  defaultIndex?: number;
  controlRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const SegmentedControlBase: React.FC<Props> = (props) => {
  const { name, segments: segments, callback, defaultIndex = 0, controlRef } = props;
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const componentReady = useRef<boolean>();

  useEffect(() => {
    componentReady.current = true;
  }, []);

  useEffect(() => {
    const activeSegmentRef = segments[activeIndex].ref;
    if (!controlRef.current || !activeSegmentRef.current) {
      return;
    }
    const { offsetWidth, offsetHeight, offsetLeft } = activeSegmentRef.current;
    const { style } = controlRef.current;

    style.setProperty('--highlight-width', `${offsetWidth}px`);
    style.setProperty('--highlight-height', `${offsetHeight}px`);
    style.setProperty('--highlight-x-pos', `${offsetLeft}px`);
  }, [activeIndex, callback, controlRef, segments]);

  const onChange = (value: any, index: any) => {
    setActiveIndex(index);
    callback(value);
  };

  return (
    <div className='controls-container bg-sky-950 rounded-full' ref={controlRef}>
      <div className={`controls ${componentReady.current ? 'ready' : 'idle'}`}>
        {segments.map((item, i) => (
          <div
            key={item.value}
            className={`segment ${i === activeIndex ? 'active' : 'inactive'}`}
            ref={item.ref}
          >
            <Button
              id={item.label}
              name={name}
              className='bg-transparent border-transparent text-white font-bold'
              radius='full'
              onClick={() => onChange(item.value, i)}
            >
              {item.label}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
