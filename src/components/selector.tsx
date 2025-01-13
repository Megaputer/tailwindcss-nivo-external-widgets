import * as React from 'react';

import { NextUIProvider } from '@nextui-org/system';
import { Select, SelectItem } from '@nextui-org/select';
import type { Selection } from '@react-types/shared';

import * as css from './selector.css';

interface Props {
  placeholder?: string;
  values: { key: number; label: string }[];
  onDrillDown?: (val?: number) => void;
  shadowRoot?: ShadowRoot;
}

export const Selector: React.FC<Props> = ({ placeholder, values, shadowRoot, onDrillDown }) => {
  const [keys, setKeys] = React.useState<Selection>();
  const ref = React.useRef(null);

  const rendererClear = () => {
    return (
      <div
        onClick={() => {
          setKeys(new Set());
          onDrillDown?.();
        }}
      >
        <CloseIcon width={16} height={16} color='#fff' />
      </div>
    );
  };

  const classes = `bg-transparent data-[hover]:bg-transparent
    data-[selectable=true]:focus:bg-sky-500/50 text-white data-[selectable=true]:focus:text-white`;

  return (
    <NextUIProvider>
      <Select
        disableAnimation={true}
        placeholder={placeholder}
        selectedKeys={keys}
        onChange={({ target }) => {
          onDrillDown?.(+target.value);
        }}
        onSelectionChange={setKeys}
        className='bg-transparent border-solid border-1 border-white rounded-full text-white font-bold'
        classNames={{
          trigger: 'bg-transparent data-[hover]:bg-transparent text-white',
          value: 'group-data-[has-value]:text-white text-white',
        }}
        popoverProps={{
          classNames: {
            content: 'bg-transparent data-[hover]:bg-transparent',
          },
          portalContainer: ref.current || undefined,
          shouldCloseOnInteractOutside: (el) => {
            if (el.shadowRoot == shadowRoot) {
              return false;
            }
            return true;
          }
        }}
        scrollShadowProps={{
          size: 5,
          hideScrollBar: false,
          className: `w-full dark ${css.scrollbar}`,
        }}
        endContent={rendererClear()}
      >
        {values.map((v) => (
          <SelectItem
            key={v.key}
            className={classes}
            value={v.key}
            classNames={{
              selectedIcon: 'text-white'
            }}
          >
            {v.label}
          </SelectItem>
        ))}
      </Select>
      <div ref={ref} style={{ position: 'fixed', zIndex: 1 }} />
    </NextUIProvider>
  );
};

interface CloseIconProps {
  width: number;
  height: number;
  color: string;
}

const CloseIcon = ({ width, height, color }: CloseIconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 32 32'
    >
      {/* eslint-disable-next-line @stylistic/max-len */}
      <path fill={color} d='M 7.21875 5.78125 L 5.78125 7.21875 L 14.5625 16 L 5.78125 24.78125 L 7.21875 26.21875 L 16 17.4375 L 24.78125 26.21875 L 26.21875 24.78125 L 17.4375 16 L 26.21875 7.21875 L 24.78125 5.78125 L 16 14.5625 Z'></path>
    </svg>
  );
};
