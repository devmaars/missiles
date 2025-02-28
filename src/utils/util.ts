export const ASSETS_SRC = 'src/assets';
export const RAD_2_DEG = 180 / Math.PI;

export const sec2min = (sec: number): [number, number] => {
  const min = Math.floor(sec / 60);
  const remainingSec = sec % 60;

  return [min, remainingSec];
};
