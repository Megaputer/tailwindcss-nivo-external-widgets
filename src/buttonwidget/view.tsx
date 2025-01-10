import * as React from 'react';
import type { ApiRequestor, ApprValue, Table } from 'pa-typings';

interface Props {
  requestor: ApiRequestor;
  getApprValue: (key: string) => ApprValue | undefined;
}

export const ButtonWidget: React.FC<Props> = ({ getApprValue }) => {
  const icon = getApprValue('icon') || '';
  const iconRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const { file } = JSON.parse(icon.toString() || '{}');
    if (!file) {
      const svg = iconRef?.current?.getElementsByTagName('svg');
      svg?.[0]?.remove();
      return;
    } else if (iconRef.current) {
      const data = atob(file.replace(/data:image\/svg\+xml;base64,/, ''));
      iconRef.current.innerHTML = data;
      const [svg] = iconRef.current.getElementsByTagName('svg');
      if (svg) {
        svg.style.height = '100%';
        svg.style.width = '100%';
      }
    }
  }, [icon]);

  const classNames = `flex size-full justify-center items-center bg-transparent border-transparent rounded-xl
  shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#08f,0_0_15px_#08f,0_0_30px_#08f]`;

  return (
    <div className={classNames}>
      <button ref={iconRef} style={{ width: 32, height: 32 }} />
    </div>
  );
};
