import * as React from 'react';

import { NextUIProvider, Select, SelectItem } from '@nextui-org/react';

import './selector.css';

import * as css from './selector.module.css';

interface Props {
  placeholder?: string;
  values: { key: number; label: string }[];
  onDrillDown?: (val: number) => void;
  shadowRoot?: ShadowRoot;
}

export const Selector: React.FC<Props> = ({ placeholder, values, onDrillDown, shadowRoot }) => {
  const ref = React.useRef(null);

  const classes = `bg-transparent data-[hover]:bg-transparent
    data-[selectable=true]:focus:bg-sky-500/50 text-white data-[selectable=true]:focus:text-white`;

  return (
    <NextUIProvider>
      <Select
        aria-label='Выборать опцию'
        disableAnimation={true}
        placeholder={placeholder}
        onChange={({ target }) => {
          onDrillDown?.(+target.value);
        }}
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
